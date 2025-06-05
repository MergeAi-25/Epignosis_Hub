
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Quiz, UserData } from '../types';
import { QuizLevel } from '../types';
import { getQuizzes, getUserDataService } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import { QuestionMarkCircleIcon, ArrowRightIcon, CheckCircleIcon, StarIcon, SearchIcon } from '../components/icons';
import { ROUTES } from '../constants';
import { useUser } from '../contexts/UserContext';

interface QuizCardProps {
  quiz: Quiz;
  progress?: { score: number; completed: boolean; currentQuestionIndex: number };
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, progress }) => {
  let levelTextClass = 'text-green-700';
  let levelBgClass = 'bg-green-100';
  if (quiz.level === QuizLevel.Intermediate) {
    levelTextClass = 'text-yellow-700';
    levelBgClass = 'bg-yellow-100';
  }
  if (quiz.level === QuizLevel.Advanced) {
    levelTextClass = 'text-red-700';
    levelBgClass = 'bg-red-100';
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group transform hover:-translate-y-1 hover:scale-[1.02]">
      {quiz.imageUrl && <img src={quiz.imageUrl} alt={quiz.title} className="w-full h-40 object-cover rounded-t-xl bg-slate-200"/>}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <QuestionMarkCircleIcon className="w-7 h-7 text-ep-primary mr-2 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-semibold text-ep-dark-text group-hover:text-ep-primary transition-colors duration-300 ease-in-out flex-grow mr-2">{quiz.title}</h3>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${levelTextClass} ${levelBgClass}`}>{quiz.level}</span>
        </div>
        <p className="text-sm text-slate-600 mb-3 flex-grow">{quiz.description}</p>
        <div className="flex items-center text-xs text-slate-500 mb-4">
            <StarIcon className="w-4 h-4 mr-1 text-ep-secondary"/> 
            <span>{quiz.questions.length} questions</span>
            <span className="mx-2">|</span>
            <span>{quiz.durationMinutes} minutes</span>
        </div>
        
        {progress && progress.completed && (
          <div className="flex items-center text-green-600 mb-3 text-sm">
            <CheckCircleIcon className="w-5 h-5 mr-1" />
            Completed! Score: {progress.score}/{quiz.questions.length}
          </div>
        )}
        <Link 
          to={`${ROUTES.QUIZZES}/${quiz.id}`} 
          className="mt-auto w-full inline-flex items-center justify-center text-white bg-ep-primary hover:bg-ep-primary-hover font-medium py-2.5 px-4 rounded-lg group transition-colors duration-300 ease-in-out text-sm"
        >
          {progress?.completed ? 'Review Quiz' : (progress && !progress.completed && (progress.currentQuestionIndex || 0) > 0 ? 'Continue Quiz' : 'Start Quiz')}
          <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
        </Link>
      </div>
    </div>
  );
};

const QuizzesPage: React.FC = () => {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzesAndUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedQuizzes = await getQuizzes();
        setAllQuizzes(fetchedQuizzes);
        setFilteredQuizzes(fetchedQuizzes); 
        if (currentUser) {
          const data = getUserDataService(currentUser.id);
          setUserData(data);
        }
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzesAndUserData();
  }, [currentUser]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const newFilteredQuizzes = allQuizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(lowercasedSearchTerm) ||
      quiz.description.toLowerCase().includes(lowercasedSearchTerm) ||
      quiz.level.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredQuizzes(newFilteredQuizzes);
  }, [searchTerm, allQuizzes]);


  if (isLoading) {
    return <LoadingSpinner message="Loading quizzes..." />;
  }

  if (error) {
    return <div className="text-center text-ep-error py-8">{error}</div>;
  }

  const getQuizProgress = (quizId: string) => {
    if (!userData || !userData.quizProgress[quizId]) return undefined;
    const progressData = userData.quizProgress[quizId];
    return { score: progressData.score, completed: progressData.completed, currentQuestionIndex: progressData.currentQuestionIndex };
  }

  const quizzesByLevel: { [key in QuizLevel]: Quiz[] } = {
    [QuizLevel.Beginner]: filteredQuizzes.filter(q => q.level === QuizLevel.Beginner),
    [QuizLevel.Intermediate]: filteredQuizzes.filter(q => q.level === QuizLevel.Intermediate),
    [QuizLevel.Advanced]: filteredQuizzes.filter(q => q.level === QuizLevel.Advanced),
  };


  return (
    <div className="container mx-auto py-8 px-4 animate-fadeInUp">
      <div className="text-center mb-8 sm:mb-10">
        <QuestionMarkCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-ep-primary mx-auto mb-3" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ep-dark-text">Bible Quizzes</h1>
        <p className="text-md sm:text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
          Test your knowledge of Scripture with our interactive Bible quizzes. Track your progress and challenge yourself to improve.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 sm:mb-10 max-w-xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="search"
            name="searchQuizzes"
            id="searchQuizzes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-ep-primary focus:border-ep-primary sm:text-sm shadow-sm"
            placeholder="Search quizzes by title, description, or difficulty..."
          />
        </div>
      </div>

      {!currentUser && (
        <div className="bg-yellow-50 border-l-4 border-ep-warning p-4 mb-8 rounded-md shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-ep-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.332-.216 3.001-1.742 3.001H4.42c-1.526 0-2.492-1.67-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-4.5a.75.75 0 00-1.5 0v2.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5h-1.75v-1.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please <Link to={ROUTES.HOME} className="font-medium underline hover:text-yellow-600 transition-colors duration-300 ease-in-out">login or create an account</Link> to save your quiz progress and track your scores.
              </p>
            </div>
          </div>
        </div>
      )}

      {filteredQuizzes.length === 0 && searchTerm && (
         <p className="text-center text-slate-500 py-6">No quizzes found for "{searchTerm}". Try a different search.</p>
      )}

      {Object.values(QuizLevel).map(level => (
        quizzesByLevel[level].length > 0 && (
          <section key={level} className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-ep-dark-text mb-6 border-b-2 border-ep-primary pb-2">{level} Level</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {quizzesByLevel[level].map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} progress={currentUser ? getQuizProgress(quiz.id) : undefined} />
              ))}
            </div>
          </section>
        )
      ))}
      
      {allQuizzes.length === 0 && !isLoading && (
        <p className="text-center text-slate-500">No quizzes available at the moment. Please check back soon!</p>
      )}
    </div>
  );
};

export default QuizzesPage;
