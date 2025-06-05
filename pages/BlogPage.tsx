
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types';
import { getBlogPosts } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRightIcon, BookOpenIcon } from '../components/icons';
import { ROUTES } from '../constants';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const postDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col group transform hover:scale-105">
      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover bg-slate-200"/>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-ep-dark-text mb-2 group-hover:text-ep-primary transition-colors duration-300 ease-in-out">{post.title}</h3>
        <p className="text-xs text-slate-500 mb-1">By {post.author} - {postDate}</p>
        <p className="text-sm text-slate-600 mb-4 flex-grow">{post.summary}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-sky-100 text-ep-primary text-xs font-semibold mr-2 mb-1 px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link to={`${ROUTES.BLOG}/${post.id}`} className="inline-flex items-center text-ep-primary hover:text-ep-primary-hover font-medium group mt-auto transition-colors duration-300 ease-in-out">
          Read More
          <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
        </Link>
      </div>
    </article>
  );
};

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading blog posts..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeInUp">
      <div className="flex items-center mb-6 sm:mb-8">
        <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-ep-primary mr-3" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ep-dark-text">Epignosis Blog</h1>
      </div>
      <p className="text-md sm:text-lg text-slate-600 mb-8 sm:mb-10">
        Dive into articles curated to deepen your understanding of Christ and His teachings.
      </p>
      
      {blogPosts.length === 0 ? (
        <p className="text-center text-slate-500">No blog posts available at the moment. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
