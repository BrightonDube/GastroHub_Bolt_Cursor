import React, { useState, useEffect } from 'react';

interface ProgressiveLoadingProps {
  /**
   * Initial fast loading UI shown for quick loads
   */
  initialLoading?: React.ReactNode;
  
  /**
   * Fallback UI shown if loading takes longer than initialTimeout
   */
  fallback?: React.ReactNode;
  
  /**
   * Recovery UI shown if loading takes longer than recoveryTimeout
   */
  recovery?: React.ReactNode;
  
  /**
   * Time in ms before showing fallback UI
   */
  initialTimeout?: number;
  
  /**
   * Time in ms before showing recovery UI
   */
  recoveryTimeout?: number;
}

/**
 * ProgressiveLoading component
 * Shows different loading states depending on how long the operation takes
 * Helps prevent infinite loading experiences
 */
export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  initialLoading = <DefaultLoadingSpinner />,
  fallback,
  recovery,
  initialTimeout = 500,
  recoveryTimeout = 10000,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, initialTimeout);
    
    const recoveryTimer = setTimeout(() => {
      setShowRecovery(true);
    }, recoveryTimeout);
    
    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(recoveryTimer);
    };
  }, [initialTimeout, recoveryTimeout]);
  
  if (showRecovery && recovery) {
    return (
      <div className="progressive-loading progressive-loading--recovery">
        {recovery}
      </div>
    );
  }
  
  if (showFallback && fallback) {
    return (
      <div className="progressive-loading progressive-loading--fallback">
        {fallback}
      </div>
    );
  }
  
  return (
    <div className="progressive-loading progressive-loading--initial">
      {initialLoading}
    </div>
  );
};

/**
 * Default loading spinner component
 */
const DefaultLoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
  </div>
);

/**
 * AuthErrorRecovery component
 * Provides recovery options for auth errors
 */
export const AuthErrorRecovery: React.FC<{ error?: Error | string | null }> = ({ error }) => {
  const errorMessage = error instanceof Error ? error.message : 
                      typeof error === 'string' ? error : 
                      'Authentication error occurred';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md max-w-md">
        <div className="flex items-center mb-3">
          <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">Authentication Problem</h3>
        </div>
        <p className="text-sm text-red-700 mb-4">{errorMessage}</p>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign In Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveLoading;
