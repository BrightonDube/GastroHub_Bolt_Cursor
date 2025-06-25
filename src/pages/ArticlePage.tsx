import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Calendar, User } from 'lucide-react';

import { ARTICLES } from './BlogArticlesData';


export function ArticlePage() {
  // Assume route is /articles/:id
  const { id } = useParams();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2 text-error-700 dark:text-error-400">Article Not Found</h1>
            <p className="text-neutral-500">Sorry, we couldn't find the article you're looking for.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-8 shadow" />
          <h1 className="text-4xl font-heading font-bold mb-4 text-primary-900 dark:text-primary-300">{article.title}</h1>
          <div className="flex items-center space-x-4 mb-6 text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.date).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            {article.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default ArticlePage;
