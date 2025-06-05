
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { StudyTopic, StudyTopicSection } from '../types';
import { getStudyTopic } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon } from '../components/icons';

const SectionContent: React.FC<{ section: StudyTopicSection }> = ({ section }) => (
  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-sky-50 rounded-xl shadow">
    <h3 className="text-lg sm:text-xl font-semibold text-ep-primary mb-3">{section.title}</h3>
    <div 
      className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: section.content }}
    />
  </div>
);

const StudyTopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<StudyTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) {
      setError('Study topic ID is missing.');
      setIsLoading(false);
      return;
    }
    const fetchTopic = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTopic = await getStudyTopic(topicId);
        if (fetchedTopic) {
          setTopic(fetchedTopic);
        } else {
          setError('Study topic not found.');
        }
      } catch (err) {
        setError('Failed to load study topic. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (isLoading) {
    return <LoadingSpinner message="Loading study topic..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!topic) {
    return <div className="text-center text-slate-500 py-8">Study topic not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl animate-fadeInUp">
      <Link to={ROUTES.STUDY_TOPICS} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover mb-6 group transition-colors duration-300 ease-in-out">
        <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
        Back to Study Topics
      </Link>

      <article className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl">
        <img src={topic.imageUrl} alt={topic.title} className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-lg mb-6 bg-slate-200"/>
        <div className="flex items-start sm:items-center text-ep-primary mb-2">
          <AcademicCapIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ep-dark-text">{topic.title}</h1>
        </div>
        <p className="text-md sm:text-lg text-slate-600 mb-8">{topic.description}</p>
        
        <div>
          {topic.contentSections.map(section => (
            <SectionContent key={section.id} section={section} />
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <h3 className="text-lg sm:text-xl font-semibold text-ep-dark-text mb-4">Further Reflection</h3>
          <p className="text-slate-500 text-sm sm:text-base">Consider journaling your thoughts on this topic or discussing it with a study group.</p>
        </div>
      </article>
    </div>
  );
};

export default StudyTopicDetailPage;
