import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Header } from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: 'Brighton Dube',
    content: '',
    image: '',
    excerpt: '',
    tags: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { title, author, content, image, excerpt, tags, category } = form;
    const { error } = await supabase.from('articles').insert([
      {
        title,
        author,
        content,
        image,
        excerpt,
        tags: tags.split(',').map(t => t.trim()),
        category
      }
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/blog'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 w-full max-w-2xl space-y-6 border border-neutral-200 dark:border-neutral-700">
          <h1 className="text-2xl font-bold mb-4 text-primary-700 dark:text-primary-300">Create New Article</h1>
          <div className="space-y-3">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input input-bordered w-full" required />
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Short excerpt" className="input input-bordered w-full" rows={2} />
            <textarea name="content" value={form.content} onChange={handleChange} placeholder="Main content (markdown or text)" className="input input-bordered w-full" rows={8} required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="input input-bordered w-full" />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input input-bordered w-full" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input input-bordered w-full" />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">Article created!</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
