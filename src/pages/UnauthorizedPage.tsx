import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Unauthorized</h1>
          <p className="mb-6 text-neutral-700 dark:text-neutral-300">You do not have permission to access this page.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
