
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export enum QuizLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: QuizLevel;
  questions: QuizQuestion[];
  imageUrl?: string;
  durationMinutes: number; // Added for quiz timer
}

export interface UserQuizProgress {
  score: number;
  completed: boolean;
  currentQuestionIndex: number;
  answers: { [questionId: string]: string }; // questionId: selectedOptionId
  timestamp?: number; 
}

export interface UserData {
  quizProgress: {
    [quizId: string]: UserQuizProgress;
  };
  // other user specific data can be added here
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string; // ISO string format
  imageUrl: string;
  summary: string;
  content: string; // Full content, can include HTML/Markdown
  tags?: string[];
}

export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  contentSections: StudyTopicSection[];
  keyVerses?: string[]; // Added for Bible Topics card
  verseCount?: number; // Added for Featured Topics card on Home Page
}

export interface StudyTopicSection {
  id: string;
  title: string;
  content: string; // Can include HTML/Markdown, scripture references
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  sources?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri?: string; // Made explicitly optional
    title?: string; // Made explicitly optional
  };
  retrievedContext?: { // For TOOL_CODE_INTERPRETER, etc.
    uri: string; // Assuming URI is required if retrievedContext exists
    title?: string; // Title might be optional here too
  };
}

export interface DailyScripture {
  id: string;
  reference: string;
  text: string;
  isFavorite?: boolean;
}
