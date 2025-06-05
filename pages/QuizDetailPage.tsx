

import React, { useState, useEffect, useCallback, useRef } from 'react';
// fix: Import useNavigate instead of useHistory for react-router-dom v6. useParams and Link are standard.
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Quiz, QuizQuestion, UserQuizProgress } from '../types';
import { getQuiz, updateUserQuizProgress, getUserQuizProgress } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from '../constants';
import { useUser } from '../contexts/UserContext';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/icons';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const QuizDetailPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  // fix: Use useNavigate hook from react-router-dom v6
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAttemptFinished, setIsAttemptFinished] = useState(false); 
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[questionId: string]: string}>({});
  const [reviewAnswers, setReviewAnswers] = useState<{[questionId: string]: string}>({});

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const loadQuizAndProgress = useCallback(async () => {
    if (!quizId || !currentUser) {
      setError("Quiz ID or user information is missing.");
      setIsLoading(false);
      // fix: Use navigate for navigation in v6
      if (!currentUser) navigate(ROUTES.HOME);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const fetchedQuiz = await getQuiz(quizId);
      if (fetchedQuiz) {
        setQuiz(fetchedQuiz);
        const progress = getUserQuizProgress(currentUser.id, quizId);
        if (progress?.completed) {
          setIsAttemptFinished(true); 
          setScore(progress.score);
          setReviewAnswers(progress.answers || {});
          setCurrentQuestionIndex(0); 
          setTimeLeft(0); 
        } else {
          setCurrentQuestionIndex(progress?.currentQuestionIndex || 0);
          setScore(progress?.score || 0);
          setUserAnswers(progress?.answers || {});
          setTimeLeft(fetchedQuiz.durationMinutes * 60);
          setIsAttemptFinished(false);
        }
      } else {
        setError('Quiz not found.');
      }
    } catch (err) {
      setError('Failed to load quiz. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [quizId, currentUser, navigate]);

  useEffect(() => {
    loadQuizAndProgress();
  }, [loadQuizAndProgress]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isAttemptFinished || !quiz) {
      if (timerRef.current) window.clearInterval(timerRef.current); 
      if (timeLeft !== null && timeLeft <= 0 && !isAttemptFinished && quiz) {
        setIsAttemptFinished(true);
        setReviewAnswers(userAnswers); 
         if(currentUser && quizId) {
            updateUserQuizProgress(currentUser.id, quizId, {
                score,
                currentQuestionIndex: quiz.questions.length, 
                completed: true,
                answers: userAnswers
            });
        }
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prevTime => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [timeLeft, isAttemptFinished, quiz, currentUser, quizId, score, userAnswers]);


  const handleOptionSelect = (optionId: string) => {
    if (isAttemptFinished) return; 
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!quiz || !selectedOptionId || isAttemptFinished) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    
    const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOptionId };
    setUserAnswers(newAnswers);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    setSelectedOptionId(null); 

    if (currentQuestionIndex === quiz.questions.length - 1) {
      setIsAttemptFinished(true);
      setReviewAnswers(newAnswers); 
      if (timerRef.current) window.clearInterval(timerRef.current); 
      if (currentUser && quizId) {
        updateUserQuizProgress(currentUser.id, quizId, {
          score: newScore,
          currentQuestionIndex: quiz.questions.length,
          completed: true,
          answers: newAnswers
        });
      }
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
       if (currentUser && quizId) {
        updateUserQuizProgress(currentUser.id, quizId, {
            score: newScore,
            currentQuestionIndex: currentQuestionIndex + 1,
            completed: false,
            answers: newAnswers
        });
      }
    }
  };

  const handleNextReviewQuestion = () => {
    if (!quiz || currentQuestionIndex >= quiz.questions.length - 1) return;
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };
  
  const handlePrevReviewQuestion = () => { 
    if (currentQuestionIndex <= 0) return;
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
  };

  const handleRetakeQuiz = () => {
    if (!quiz || !currentUser || !quizId) return;
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAttemptFinished(false);
    setScore(0);
    setUserAnswers({});
    setReviewAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    updateUserQuizProgress(currentUser.id, quizId, { 
        score: 0, 
        currentQuestionIndex: 0, 
        completed: false, 
        answers: {} 
    });
  };

  if (isLoading) return <LoadingSpinner message="Loading quiz..." />;
  if (error) return <div className="text-center text-ep-error py-8">{error}</div>;
  if (!quiz) return <div className="text-center text-slate-500 py-8">Quiz data not available.</div>;

  const currentQuestion: QuizQuestion | undefined = quiz.questions[currentQuestionIndex];
  const progressPercentage = isAttemptFinished ? 100 : (currentQuestionIndex / quiz.questions.length) * 100;


  if (isAttemptFinished) {
    const reviewQuestion = quiz.questions[currentQuestionIndex]; 
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl animate-fadeInUp">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-ep-dark-text mb-2 text-center">{quiz.title}</h2>
          <p className="text-center text-lg font-semibold mb-1 text-ep-primary">Quiz Finished!</p>
          {timeLeft !== null && timeLeft <=0 && currentQuestionIndex < quiz.questions.length -1 && (
            <p className="text-center text-ep-warning mb-4 font-semibold">Time's up!</p>
          )}
          <div className="text-center text-md sm:text-lg text-slate-700 mb-6">
            Your final score: <span className="font-bold text-ep-primary">{score}</span> out of <span className="font-bold">{quiz.questions.length}</span>
          </div>
          <div className="mb-6 px-2 sm:px-0">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-ep-success h-3 rounded-full" style={{ width: `${(score/quiz.questions.length)*100}%` }}></div>
            </div>
            <p className="text-center text-xs sm:text-sm text-slate-500 mt-1">You answered {score} correctly!</p>
          </div>
          
           <div className="border-t pt-4 mt-4">
              <h3 className="text-lg sm:text-xl font-semibold text-ep-dark-text mb-3">Review Your Answers:</h3>
              {reviewQuestion && (
                <>
                  <p className="text-xs sm:text-sm text-slate-600 mb-1">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                  <h4 className="text-md sm:text-lg font-medium text-slate-800 mb-4">{reviewQuestion.text}</h4>
                  <div className="space-y-3 mb-4">
                    {reviewQuestion.options.map(option => {
                      const userSelectedThisOption = reviewAnswers[reviewQuestion.id] === option.id;
                      const isCorrectOption = option.id === reviewQuestion.correctOptionId;
                      
                      let bgColor = 'bg-slate-50';
                      let borderColor = 'border-slate-300';
                      let icon = null;

                      if (isCorrectOption) {
                        bgColor = 'bg-green-100';
                        borderColor = 'border-green-500';
                        icon = <CheckCircleIcon className="w-5 h-5 inline-block ml-2 text-ep-success flex-shrink-0" />;
                      }
                      if (userSelectedThisOption && !isCorrectOption) {
                        bgColor = 'bg-red-100';
                        borderColor = 'border-red-500';
                        icon = <XCircleIcon className="w-5 h-5 inline-block ml-2 text-ep-error flex-shrink-0" />;
                      }
                      
                      return (
                        <div
                          key={option.id}
                          className={`w-full text-left p-3 rounded-lg border ${borderColor} ${bgColor} flex justify-between items-center text-sm sm:text-base ${userSelectedThisOption ? 'ring-2 ring-ep-primary' : ''}`}
                        >
                          <span className="flex-grow">{option.text}</span>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                    <div className="flex items-center text-sky-700 mb-1">
                        <LightBulbIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p className="text-sm font-semibold">Explanation:</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">{reviewQuestion.explanation}</p>
                  </div>
                </>
              )}
              <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
                <button 
                    onClick={handlePrevReviewQuestion} 
                    disabled={currentQuestionIndex === 0}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors duration-300 ease-in-out text-sm"
                >
                    Previous
                </button>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                     <button 
                        onClick={handleNextReviewQuestion}
                        className="w-full sm:w-auto px-4 py-2 bg-ep-primary text-white rounded-lg hover:bg-ep-primary-hover transition-colors duration-300 ease-in-out text-sm"
                    >
                        Next
                    </button>
                ) : (
                     <span className="w-full sm:w-auto px-4 py-2 text-slate-500 text-center text-sm">End of Review</span>
                )}
              </div>
           </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleRetakeQuiz}
              className="w-full sm:w-auto bg-ep-secondary hover:bg-ep-secondary-hover text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
            >
              Retake Quiz
            </button>
            <Link
              to={ROUTES.QUIZZES}
              className="w-full sm:w-auto block text-center bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentQuestion) { 
    return <div className="text-center text-slate-500 py-8">Loading question...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl animate-fadeInUp">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 space-y-1 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-ep-dark-text order-2 sm:order-1">{quiz.title}</h2>
          <div className="text-sm text-slate-500 font-medium order-1 sm:order-2 self-end sm:self-center">
            {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 mb-1">Score: {score}</div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
          <div className="bg-ep-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-1">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        <h3 className="text-lg sm:text-xl font-medium text-slate-800 mb-6">{currentQuestion.text}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ease-in-out flex justify-between items-center text-sm sm:text-base
                ${selectedOptionId === option.id 
                  ? "bg-sky-100 border-ep-primary ring-2 ring-ep-primary text-ep-primary font-semibold" 
                  : "bg-slate-50 hover:bg-sky-50 text-slate-800 border-slate-300 hover:border-sky-300"
                }`}
            >
              <span>{option.text}</span>
              {selectedOptionId === option.id && <CheckCircleIcon className="w-5 h-5 text-ep-primary flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <Link to={ROUTES.QUIZZES} className="inline-flex items-center text-xs sm:text-sm text-slate-600 hover:text-ep-primary group transition-colors duration-300 ease-in-out order-2 sm:order-1">
            <ArrowLeftIcon className="w-4 h-4 mr-1 transform group-hover:-translate-x-0.5 transition-transform duration-300 ease-in-out" />
            Exit Quiz
          </Link>
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOptionId || timeLeft === 0}
            className="w-full sm:w-auto bg-ep-primary hover:bg-ep-primary-hover text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-300 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed order-1 sm:order-2 text-sm sm:text-base"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
             <ArrowRightIcon className="w-4 h-4 ml-2 inline-block"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;