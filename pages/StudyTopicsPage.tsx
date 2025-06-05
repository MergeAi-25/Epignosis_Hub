
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { StudyTopic } from '../types';
import { getStudyTopics } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AcademicCapIcon, ArrowRightIcon, BookOpenIcon, SearchIcon } from '../components/icons';
import { ROUTES } from '../constants';

const StudyTopicCard: React.FC<{ topic: StudyTopic }> = ({ topic }) => (
  <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group transform hover:-translate-y-1 hover:scale-[1.02]">
    <img src={topic.imageUrl} alt={topic.title} className="w-full h-48 object-cover rounded-t-xl bg-slate-200"/>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-start mb-2">
        <BookOpenIcon className="w-7 h-7 text-ep-primary mr-2 flex-shrink-0 mt-0.5" />
        <h3 className="text-lg font-semibold text-ep-dark-text group-hover:text-ep-primary transition-colors duration-300 ease-in-out flex-grow">{topic.title}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-3 flex-grow">{topic.description}</p>
      {topic.keyVerses && topic.keyVerses.length > 0 && (
        <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-1">Key Verses:</p>
            <div className="flex flex-wrap gap-1.5">
                {topic.keyVerses.slice(0,3).map(verse => ( // Show max 3 key verses
                <span key={verse} className="inline-block bg-sky-100 text-ep-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    {verse}
                </span>
                ))}
                {topic.keyVerses.length > 3 && (
                     <span className="inline-block bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                        +{topic.keyVerses.length - 3} more
                    </span>
                )}
            </div>
        </div>
      )}
      <Link 
        to={`${ROUTES.STUDY_TOPICS}/${topic.id}`} 
        className="mt-auto w-full inline-flex items-center justify-center text-white bg-ep-primary hover:bg-ep-primary-hover font-medium py-2.5 px-4 rounded-lg group transition-colors duration-300 ease-in-out text-sm"
      >
        Study This Topic
        <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
      </Link>
    </div>
  </article>
);

const StudyTopicsPage: React.FC = () => {
  const [allStudyTopics, setAllStudyTopics] = useState<StudyTopic[]>([]);
  const [filteredStudyTopics, setFilteredStudyTopics] = useState<StudyTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const topics = await getStudyTopics();
        setAllStudyTopics(topics);
        setFilteredStudyTopics(topics);
      } catch (err) {
        setError('Failed to load study topics. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);
  
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const newFilteredTopics = allStudyTopics.filter(topic => 
      topic.title.toLowerCase().includes(lowercasedSearchTerm) ||
      topic.description.toLowerCase().includes(lowercasedSearchTerm) ||
      (topic.keyVerses && topic.keyVerses.some(v => v.toLowerCase().includes(lowercasedSearchTerm)))
    );
    setFilteredStudyTopics(newFilteredTopics);
  }, [searchTerm, allStudyTopics]);


  if (isLoading) {
    return <LoadingSpinner message="Loading study topics..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeInUp">
      <div className="text-center mb-8 sm:mb-10">
        <AcademicCapIcon className="w-12 h-12 sm:w-14 sm:h-14 text-ep-primary mx-auto mb-3" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ep-dark-text">Bible Study Topics</h1>
        <p className="text-md sm:text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
          Explore in-depth studies on key biblical topics with scripture references and explanations.
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
            name="searchTopics"
            id="searchTopics"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-ep-primary focus:border-ep-primary sm:text-sm shadow-sm"
            placeholder="Search topics by title, description, or verse..."
          />
        </div>
      </div>
      
      {filteredStudyTopics.length === 0 ? (
        <p className="text-center text-slate-500 py-6">{searchTerm ? `No topics found for "${searchTerm}". Try a different search.` : "No study topics available at the moment. Check back soon!"}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStudyTopics.map(topic => (
            <StudyTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyTopicsPage;
