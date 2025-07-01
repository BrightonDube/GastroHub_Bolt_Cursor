import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentSASTTime } from '../utils/dateUtils';

export interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  experience_level: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  salary_range?: string;
  is_active: boolean;
  posted_date: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPostFormData {
  title: string;
  department: string;
  location: string;
  job_type: string;
  experience_level: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  salary_range?: string;
  application_deadline?: string;
}

export function useJobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active job posts
  const fetchJobPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_posts')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setJobPosts(data || []);
    } catch (err) {
      console.error('Error fetching job posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch job posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new job post
  const createJobPost = async (jobPostData: JobPostFormData): Promise<JobPost | null> => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('job_posts')
        .insert([{
          ...jobPostData,
          posted_date: getCurrentSASTTime().toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Update local state
      setJobPosts(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Error creating job post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create job post');
      return null;
    }
  };

  // Update a job post
  const updateJobPost = async (id: string, updates: Partial<JobPostFormData>): Promise<JobPost | null> => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('job_posts')
        .update({
          ...updates,
          updated_at: getCurrentSASTTime().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setJobPosts(prev => prev.map(post => post.id === id ? data : post));
      
      return data;
    } catch (err) {
      console.error('Error updating job post:', err);
      setError(err instanceof Error ? err.message : 'Failed to update job post');
      return null;
    }
  };

  // Delete/deactivate a job post
  const deleteJobPost = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('job_posts')
        .update({ 
          is_active: false,
          updated_at: getCurrentSASTTime().toISOString()
        })
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setJobPosts(prev => prev.filter(post => post.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting job post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete job post');
      return false;
    }
  };

  // Get a single job post by ID
  const getJobPost = async (id: string): Promise<JobPost | null> => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error('Error fetching job post:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch job post');
      return null;
    }
  };

  // Get job posts by department
  const getJobPostsByDepartment = async (department: string): Promise<JobPost[]> => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_posts')
        .select('*')
        .eq('department', department)
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching job posts by department:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch job posts');
      return [];
    }
  };

  // Get analytics for job posts
  const getJobPostAnalytics = async () => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_posts')
        .select('department, is_active')
        .eq('is_active', true);

      if (fetchError) {
        throw fetchError;
      }

      const analytics = {
        totalActive: data?.length || 0,
        byDepartment: data?.reduce((acc, post) => {
          acc[post.department] = (acc[post.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      return analytics;
    } catch (err) {
      console.error('Error fetching job post analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      return null;
    }
  };

  // Initialize data fetching
  useEffect(() => {
    fetchJobPosts();
  }, []);

  return {
    jobPosts,
    isLoading,
    error,
    fetchJobPosts,
    createJobPost,
    updateJobPost,
    deleteJobPost,
    getJobPost,
    getJobPostsByDepartment,
    getJobPostAnalytics,
    refreshJobPosts: fetchJobPosts
  };
}

export default useJobPosts; 