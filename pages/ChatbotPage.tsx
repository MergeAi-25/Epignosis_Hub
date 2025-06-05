
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Part } from '@google/genai'; 
import { initializeChat, sendMessageStream, isGeminiInitialized } from '../services/geminiService';
import type { ChatMessage as Message, GroundingChunk } from '../types';
import { PaperAirplaneIcon } from '../components/icons'; // Changed from SparklesIcon
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage: React.FC<{ message: Message; isLatestAIMessage: boolean }> = ({ message, isLatestAIMessage }) => {
  const isUser = message.sender === 'user';
  const animationClass = isUser ? 'animate-fadeInUp' : (isLatestAIMessage ? 'animate-chatMessageIn' : '');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${animationClass}`}>
      <div 
        className={`max-w-lg md:max-w-xl px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-md ${isUser ? 'bg-ep-primary text-white' : 'bg-slate-100 text-slate-800'}`}
        aria-live={message.sender === 'ai' ? 'polite' : undefined}
        aria-atomic="true"
      >
        <ReactMarkdown
          children={message.text}
          remarkPlugins={[remarkGfm]}
          className="text-sm sm:text-base break-words"
          components={{
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className={`hover:underline ${isUser ? 'text-sky-200' : 'text-sky-600'}`} />
          }}
        />
        {message.timestamp && <p className={`text-xs mt-1 ${isUser ? 'text-sky-200 text-right' : 'text-slate-400 text-left'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
        {message.sender === 'ai' && message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-xs font-semibold mb-1 text-slate-600">Sources:</p>
            <ul className="list-disc list-inside space-y-1">
              {message.sources.map((source, index) => 
                source.web && source.web.uri && ( 
                <li key={index} className="text-xs text-slate-500">
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-600 break-all">
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [latestAIMessageId, setLatestAIMessageId] = useState<string | null>(null);


  const initChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await initializeChat();
      if (!success) {
        setError("Failed to initialize chat. AI features may be unavailable. Please ensure the application is configured correctly or contact support.");
      } else {
        if (messages.length === 0) {
          const initialMsgId = Date.now().toString();
          setMessages([{ 
            id: initialMsgId, 
            sender: 'ai', 
            text: "Hello! I am EpignosAI, your assistant for exploring Christian faith and the Bible. How can I help you today?", 
            timestamp: Date.now() 
          }]);
          setLatestAIMessageId(initialMsgId);
        }
      }
    } catch (e: any) {
      console.error("Init chat error:", e);
      setError(e.message || "An unexpected error occurred during chat initialization. AI features may be unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, [messages.length]); 

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!isGeminiInitialized()) { 
        setError("AI Chatbot is not available. Please ensure the application is configured correctly or contact support.");
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setLatestAIMessageId(null); // Reset latest AI message ID before new AI response

    try {
      const streamResponse = await sendMessageStream(userMessage.text, undefined);
      if (!streamResponse) {
          throw new Error("Failed to get response stream.");
      }
      
      let aiResponseText = '';
      const aiMessageId = Date.now().toString() + '-ai';
      setLatestAIMessageId(aiMessageId);
      
      // Add a placeholder for the AI message immediately for smoother UI update
      setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '▋', timestamp: Date.now() }]);
      
      let currentSources: GroundingChunk[] | undefined = [];

      // Process text stream
      if (streamResponse.textStream) {
        for await (const textChunk of streamResponse.textStream) {
          aiResponseText += textChunk;
          setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, text: aiResponseText + "▋" } : msg));
        }
      }
      
      // Final update to remove cursor and set sources
      // Sources are typically available at the end of the stream or with the final chunk
      if (streamResponse.sourcesStream) {
        for await (const sourcesChunk of streamResponse.sourcesStream) { // Iterate to get the last source information if streamed
            if (sourcesChunk) {
                 currentSources = [...(currentSources || []), ...sourcesChunk.map(sc => ({ 
                    web: sc.web ? { uri: sc.web.uri, title: sc.web.title } : undefined,
                    retrievedContext: sc.retrievedContext ? { uri: sc.retrievedContext.uri, title: sc.retrievedContext.title } : undefined,
                 }))];
            }
        }
      }
      
       setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? 
        {...msg, text: aiResponseText, sources: currentSources?.filter(s => s.web && s.web.uri) } : 
        msg
      ));

    } catch (e: any) {
      console.error("Send message error:", e);
      const errorMessage = e.message || "An error occurred while communicating with the AI.";
      setError(errorMessage);
      const errorMsgId = Date.now().toString() + '-error';
      setMessages(prev => [...prev, { id: errorMsgId, sender: 'ai', text: `Error: ${errorMessage}`, timestamp: Date.now() }]);
      setLatestAIMessageId(errorMsgId);
    } finally {
      setIsLoading(false);
      // Ensure cursor is removed from the final message if streaming stopped early
      setMessages(prev => prev.map(msg => {
        if (msg.id === latestAIMessageId && msg.text.endsWith("▋")) {
            return {...msg, text: msg.text.slice(0, -1)};
        }
        return msg;
      }));
    }
  };
  

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-3xl flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] animate-fadeInUp">
      {/* Removed page title for a cleaner, ChatGPT-like UI */}
      {/* 
      <div className="flex items-center mb-4 sm:mb-6">
        <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-ep-primary mr-3" />
        <h1 className="text-2xl sm:text-3xl font-bold text-ep-dark-text">EpignosAI Chatbot</h1>
      </div> 
      */}
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-sm text-red-700" role="alert">{error}</div>}
      
      <div className="flex-grow overflow-y-auto bg-white p-3 sm:p-4 rounded-lg shadow-inner mb-4 border border-slate-200">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} isLatestAIMessage={msg.id === latestAIMessageId && msg.sender === 'ai'} />)}
        {isLoading && messages[messages.length-1]?.sender === 'user' && !messages.find(m => m.id === latestAIMessageId && m.sender === 'ai') && (
          <div className="flex justify-start mb-4 animate-chatMessageIn">
            <div className="max-w-xs px-4 py-3 rounded-lg shadow-md bg-slate-100 text-slate-800">
              <LoadingSpinner size="sm" message="EpignosAI is thinking..." />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto bg-white p-3 sm:p-4 rounded-lg shadow-md border border-slate-200">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={"Ask about faith, Bible, Jesus..."}
            className="flex-grow px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ep-primary focus:border-transparent outline-none transition-shadow duration-300 ease-in-out text-sm sm:text-base"
            disabled={isLoading || !isGeminiInitialized()} 
            aria-label="Chat input"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !isGeminiInitialized()} 
            className="bg-ep-primary text-white p-3 rounded-lg hover:bg-ep-primary-hover transition-colors duration-300 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <PaperAirplaneIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
