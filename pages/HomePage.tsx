
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME, APP_TAGLINE } from '../constants';
import { 
    BookOpenIcon, QuestionMarkCircleIcon, AcademicCapIcon, ChatBubbleLeftEllipsisIcon, 
    ArrowRightIcon, UserCircleIcon, HeartIcon
} from '../components/icons';
import { useUser } from '../contexts/UserContext';
import type { Quiz, StudyTopic, DailyScripture } from '../types';
import { getQuizzes, getStudyTopics, getDailyScriptures } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';

const FeatureCard: React.FC<{ title: string; description: string; linkTo: string; icon: React.ReactNode; linkText: string; action?: () => void; }> = 
  ({ title, description, linkTo, icon, linkText, action }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group transform hover:-translate-y-1 hover:scale-[1.02]">
    <div className="text-ep-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-ep-dark-text mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-4 flex-grow">{description}</p>
    {action ? (
      <button onClick={action} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover font-medium group mt-auto transition-colors duration-300 ease-in-out">
        {linkText}
        <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
      </button>
    ) : (
      <Link to={linkTo} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover font-medium group mt-auto transition-colors duration-300 ease-in-out">
        {linkText}
        <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
      </Link>
    )}
  </div>
);

const QuickAccessQuizItem: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
    let levelColor = 'text-green-600 bg-green-100';
    if (quiz.level === 'Intermediate') levelColor = 'text-yellow-600 bg-yellow-100';
    if (quiz.level === 'Advanced') levelColor = 'text-red-600 bg-red-100';

    return (
        <li className="py-2">
            <Link to={`${ROUTES.QUIZZES}/${quiz.id}`} className="flex justify-between items-center group">
                <span className="text-sm text-slate-700 group-hover:text-ep-primary transition-colors">{quiz.title}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColor}`}>{quiz.level}</span>
            </Link>
        </li>
    );
};

const QuickAccessTopicItem: React.FC<{ topic: StudyTopic }> = ({ topic }) => (
    <li className="py-2">
        <Link to={`${ROUTES.STUDY_TOPICS}/${topic.id}`} className="flex justify-between items-center group">
            <span className="text-sm text-slate-700 group-hover:text-ep-primary transition-colors">{topic.title}</span>
            {topic.verseCount && <span className="text-xs text-slate-500">{topic.verseCount} verses</span>}
        </Link>
    </li>
);

const DailyScriptureCard: React.FC<{ scripture: DailyScripture }> = ({ scripture }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg relative group transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <BookOpenIcon className="w-6 h-6 text-ep-primary mb-2" />
        <h4 className="font-semibold text-md text-ep-dark-text mb-1">{scripture.reference}</h4>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">"{scripture.text}"</p>
        <button 
            aria-label="Favorite scripture" 
            className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1"
            onClick={() => console.log("Favorite clicked for " + scripture.id)} // Placeholder
        >
            <HeartIcon className="w-5 h-5" filled={scripture.isFavorite} />
        </button>
    </div>
);


const HomePage: React.FC = () => {
  const { currentUser, login } = useUser();
  const [popularQuizzes, setPopularQuizzes] = useState<Quiz[]>([]);
  const [featuredTopics, setFeaturedTopics] = useState<StudyTopic[]>([]);
  const [dailyScriptures, setDailyScriptures] = useState<DailyScripture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [quizzes, topics, scriptures] = await Promise.all([
                getQuizzes(),
                getStudyTopics(),
                getDailyScriptures()
            ]);
            setPopularQuizzes(quizzes.slice(0, 3)); // Show first 3 as "popular"
            setFeaturedTopics(topics.slice(0, 3)); // Show first 3 as "featured"
            setDailyScriptures(scriptures.slice(0, 3)); // Show first 3 daily scriptures
        } catch (error) {
            console.error("Failed to fetch home page data:", error);
        }
        setIsLoading(false);
    };
    fetchData();
  }, []);


  return (
    <div className="animate-fadeInUp space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16">
        <div className="container mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ep-primary mb-4 font-sans tracking-tight">
            Grow in Knowledge and Faith
          </h1>
          <p className="text-md sm:text-lg text-slate-600 mb-8 max-w-xl sm:max-w-2xl mx-auto">
            {APP_TAGLINE}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to={ROUTES.STUDY_TOPICS}
              className="w-full sm:w-auto bg-ep-primary hover:bg-ep-primary-hover text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base transform hover:scale-105"
            >
              Start Studying
            </Link>
            <Link 
              to={ROUTES.QUIZZES}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-ep-primary font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg border border-ep-primary transition-all duration-300 ease-in-out text-base transform hover:scale-105"
            >
              Take a Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ep-dark-text text-center mb-8 sm:mb-10">Features to Enhance Your Bible Study</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <FeatureCard 
            title="Bible Topics"
            description="Explore in-depth studies on key biblical topics with scripture references and explanations."
            linkTo={ROUTES.STUDY_TOPICS}
            icon={<AcademicCapIcon className="w-10 h-10" />}
            linkText="Browse Topics"
          />
          <FeatureCard 
            title="Bible Quizzes"
            description="Test your biblical knowledge with interactive quizzes on various difficulty levels."
            linkTo={ROUTES.QUIZZES}
            icon={<QuestionMarkCircleIcon className="w-10 h-10" />}
            linkText="Take a Quiz"
          />
          <FeatureCard 
            title="Bible Chat"
            description="Ask questions and get AI-powered insights on biblical passages and concepts."
            linkTo={ROUTES.CHATBOT}
            icon={<ChatBubbleLeftEllipsisIcon className="w-10 h-10" />}
            linkText="Start Chatting"
          />
          <FeatureCard 
            title="Personal Profile"
            description="Track your progress, save favorite verses, and customize your study experience."
            linkTo={ROUTES.PROFILE}
            icon={<UserCircleIcon className="w-10 h-10" />}
            linkText="View Profile"
          />
        </div>
      </section>

      {/* Quick Access Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ep-dark-text text-center mb-8 sm:mb-10">Quick Access</h2>
        {isLoading ? (
            <LoadingSpinner message="Loading quick access content..."/>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-ep-dark-text mb-4">Popular Quizzes</h3>
            {popularQuizzes.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                    {popularQuizzes.map(quiz => <QuickAccessQuizItem key={quiz.id} quiz={quiz} />)}
                </ul>
            ) : <p className="text-sm text-slate-500">No popular quizzes available yet.</p>}
            <Link to={ROUTES.QUIZZES} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover font-medium group mt-6 transition-colors duration-300 ease-in-out text-sm">
              View All Quizzes
              <ArrowRightIcon className="w-3 h-3 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-ep-dark-text mb-4">Featured Topics</h3>
            {featuredTopics.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                    {featuredTopics.map(topic => <QuickAccessTopicItem key={topic.id} topic={topic} />)}
                </ul>
            ): <p className="text-sm text-slate-500">No featured topics available yet.</p>}
            <Link to={ROUTES.STUDY_TOPICS} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover font-medium group mt-6 transition-colors duration-300 ease-in-out text-sm">
              View All Topics
              <ArrowRightIcon className="w-3 h-3 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
        )}
      </section>

      {/* Daily Scripture Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ep-dark-text text-center mb-8 sm:mb-10">Daily Scripture</h2>
        {isLoading ? (
            <LoadingSpinner message="Loading daily scriptures..."/>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {dailyScriptures.length > 0 ? dailyScriptures.map(scripture => (
                <DailyScriptureCard key={scripture.id} scripture={scripture} />
            )) : <p className="col-span-full text-center text-sm text-slate-500">Daily scriptures coming soon.</p>}
        </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;
