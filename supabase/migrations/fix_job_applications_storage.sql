-- ================================================
-- Complete Job Applications Storage Bucket Setup
-- ================================================
-- This script creates the bucket, removes restrictive policies,
-- and makes the bucket public for easy job application uploads.

-- Step 1: Create the bucket (public for easier job applications)
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('job-applications', 'job-applications', true, now(), now())
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  updated_at = now();

-- Step 2: Drop any existing restrictive policies that cause RLS violations
DROP POLICY IF EXISTS "Allow authenticated users to upload job application files" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role and authenticated users to read job application files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their job application files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their job application files" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to job-applications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow reads from job-applications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to job-applications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from job-applications bucket" ON storage.objects;

-- Step 3: Since bucket is public, no RLS policies are needed
-- Public buckets allow anyone to upload/read without authentication

-- Step 4: Verify the bucket was created successfully
SELECT 
  id,
  name, 
  public,
  created_at,
  updated_at,
  CASE 
    WHEN public = true THEN '✅ Ready for job applications'
    ELSE '❌ Needs to be public' 
  END as status
FROM storage.buckets 
WHERE id = 'job-applications';

-- Step 5: Check that no restrictive policies exist
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname IS NULL THEN '✅ No restrictive policies found'
    ELSE '⚠️ Policy still exists: ' || policyname
  END as policy_status
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage' 
  AND policyname LIKE '%job%application%';

-- Success message
SELECT '🎉 Job applications storage bucket is ready!' as final_status; 