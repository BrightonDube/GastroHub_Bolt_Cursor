-- Create storage bucket for job applications
-- This migration creates the bucket and sets up policies for secure file uploads

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('job-applications', 'job-applications', false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload job application files" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'job-applications' 
  AND auth.role() = 'authenticated'
);

-- Policy to allow service role and authenticated users to read files
CREATE POLICY "Allow service role and authenticated users to read job application files" 
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'job-applications'
  AND (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.role() = 'authenticated'
  )
);

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their job application files" 
ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'job-applications'
  AND auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their job application files" 
ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'job-applications'
  AND auth.role() = 'authenticated'
); 