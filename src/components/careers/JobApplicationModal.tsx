import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Linkedin,
  Globe,
  Briefcase
} from 'lucide-react';

// Validation schema with security measures
const jobApplicationSchema = z.object({
  // Personal Information
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Full name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number'),
  currentLocation: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters'),
  
  // Professional Information
  yearsExperience: z.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high'),
  coverLetter: z.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters'),
  availableStartDate: z.string()
    .min(1, 'Please select an available start date'),
  salaryExpectation: z.string()
    .max(50, 'Salary expectation must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  
  // Optional Links
  linkedinUrl: z.string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  portfolioUrl: z.string()
    .url('Please enter a valid portfolio URL')
    .optional()
    .or(z.literal('')),
  
  // File upload (handled separately)
  resume: z.instanceof(File, { message: 'Please upload your resume' })
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPost: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
  };
}

export function JobApplicationModal({ isOpen, onClose, jobPost }: JobApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema.omit({ resume: true })),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      currentLocation: '',
      yearsExperience: 0,
      coverLetter: '',
      availableStartDate: '',
      salaryExpectation: '',
      linkedinUrl: '',
      portfolioUrl: ''
    }
  });

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('job-applications')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Failed to upload resume: ' + uploadError.message);
    }

    // Get public URL
    const { data } = supabase.storage
      .from('job-applications')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Sanitize form data before sending
  const sanitizeFormData = (data: JobApplicationFormData) => {
    return {
      fullName: DOMPurify.sanitize(data.fullName.trim()),
      email: DOMPurify.sanitize(data.email.trim().toLowerCase()),
      phone: DOMPurify.sanitize(data.phone.trim()),
      currentLocation: DOMPurify.sanitize(data.currentLocation.trim()),
      yearsExperience: data.yearsExperience,
      coverLetter: DOMPurify.sanitize(data.coverLetter.trim()),
      availableStartDate: data.availableStartDate,
      salaryExpectation: data.salaryExpectation ? DOMPurify.sanitize(data.salaryExpectation.trim()) : '',
      linkedinUrl: data.linkedinUrl ? DOMPurify.sanitize(data.linkedinUrl.trim()) : '',
      portfolioUrl: data.portfolioUrl ? DOMPurify.sanitize(data.portfolioUrl.trim()) : '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      source: 'job_application_form',
      jobPost: {
        id: jobPost.id,
        title: jobPost.title,
        department: jobPost.department,
        location: jobPost.location,
        type: jobPost.type
      }
    };
  };

  const onSubmit = async (data: JobApplicationFormData) => {
    if (!resumeFile) {
      setSubmitError('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Upload resume file
      setResumeUploadProgress(25);
      const resumeUrl = await handleFileUpload(resumeFile);
      setResumeUploadProgress(50);

      // Sanitize the form data
      const sanitizedData = sanitizeFormData(data);
      setResumeUploadProgress(75);

      // Send email using the same service as contact form
      const emailData = {
        ...sanitizedData,
        resumeUrl,
        recipientEmail: 'careers@gastrohub.co.za',
        subject: `Job Application: ${jobPost.title} - ${sanitizedData.fullName}`,
        message: `
New job application received for ${jobPost.title}

Applicant Information:
- Name: ${sanitizedData.fullName}
- Email: ${sanitizedData.email}
- Phone: ${sanitizedData.phone}
- Location: ${sanitizedData.currentLocation}
- Years of Experience: ${sanitizedData.yearsExperience}
- Available Start Date: ${sanitizedData.availableStartDate}
- Salary Expectation: ${sanitizedData.salaryExpectation || 'Not specified'}

Professional Links:
- LinkedIn: ${sanitizedData.linkedinUrl || 'Not provided'}
- Portfolio: ${sanitizedData.portfolioUrl || 'Not provided'}

Cover Letter:
${sanitizedData.coverLetter}

Resume: ${resumeUrl}

Job Details:
- Position: ${jobPost.title}
- Department: ${jobPost.department}
- Location: ${jobPost.location}
- Type: ${jobPost.type}

Application submitted on: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
        `.trim()
      };

      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: emailData
      });

      if (error) {
        console.error('Error sending job application:', error);
        throw new Error(error.message || 'Failed to send application');
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setResumeUploadProgress(100);
      
      // Success
      setIsSubmitted(true);
      reset();
      setResumeFile(null);
      setResumeUploadProgress(0);
    } catch (error) {
      console.error('Job application error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to send application. Please try again or email us directly.'
      );
      setResumeUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setSubmitError('Please upload a PDF or Word document');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size must be less than 5MB');
        return;
      }

      setResumeFile(file);
      setSubmitError(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setResumeFile(null);
      setIsSubmitted(false);
      setSubmitError(null);
      setResumeUploadProgress(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Apply for Position</h2>
            <p className="text-muted-foreground mt-1">
              {jobPost.title} • {jobPost.department} • {jobPost.location}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Success State */}
        {isSubmitted && (
          <div className="p-6">
            <Card className="text-center p-8 bg-success-50 border-success-200">
              <CheckCircle className="w-16 h-16 text-success-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-success-800 mb-2">
                Application Submitted Successfully!
              </h3>
              <p className="text-success-700 mb-6">
                Thank you for your interest in the {jobPost.title} position. 
                We've received your application and will review it within 48 hours.
              </p>
              <p className="text-sm text-success-600 mb-6">
                You'll receive a confirmation email shortly, and we'll be in touch 
                regarding next steps in our hiring process.
              </p>
              <Button onClick={handleClose}>
                Close
              </Button>
            </Card>
          </div>
        )}

        {/* Form */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Error Display */}
            {submitError && (
              <Card className="p-4 bg-error-50 border-error-200">
                <div className="flex items-center space-x-2 text-error-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">{submitError}</span>
                </div>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    {...register('fullName')}
                    placeholder="John Doe"
                    className={errors.fullName ? 'border-error-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-error-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="john@example.com"
                      className={`pl-10 ${errors.email ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('phone')}
                      type="tel"
                      placeholder="+27 12 345 6789"
                      className={`pl-10 ${errors.phone ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-error-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('currentLocation')}
                      placeholder="Cape Town, South Africa"
                      className={`pl-10 ${errors.currentLocation ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.currentLocation && (
                    <p className="text-error-500 text-sm mt-1">{errors.currentLocation.message}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Years of Experience *
                  </label>
                  <Input
                    {...register('yearsExperience', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="50"
                    placeholder="5"
                    className={errors.yearsExperience ? 'border-error-500' : ''}
                  />
                  {errors.yearsExperience && (
                    <p className="text-error-500 text-sm mt-1">{errors.yearsExperience.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Available Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('availableStartDate')}
                      type="date"
                      className={`pl-10 ${errors.availableStartDate ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.availableStartDate && (
                    <p className="text-error-500 text-sm mt-1">{errors.availableStartDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Salary Expectation (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('salaryExpectation')}
                      placeholder="R50,000 - R70,000 per month"
                      className={`pl-10 ${errors.salaryExpectation ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.salaryExpectation && (
                    <p className="text-error-500 text-sm mt-1">{errors.salaryExpectation.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('linkedinUrl')}
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`pl-10 ${errors.linkedinUrl ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.linkedinUrl && (
                    <p className="text-error-500 text-sm mt-1">{errors.linkedinUrl.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Portfolio URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      {...register('portfolioUrl')}
                      type="url"
                      placeholder="https://yourportfolio.com"
                      className={`pl-10 ${errors.portfolioUrl ? 'border-error-500' : ''}`}
                    />
                  </div>
                  {errors.portfolioUrl && (
                    <p className="text-error-500 text-sm mt-1">{errors.portfolioUrl.message}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Cover Letter */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Cover Letter *
              </h3>
              <textarea
                {...register('coverLetter')}
                rows={6}
                placeholder="Tell us why you're interested in this position and why you'd be a great fit for our team..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.coverLetter ? 'border-error-500' : 'border-neutral-300'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-error-500 text-sm mt-1">{errors.coverLetter.message}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {watch('coverLetter')?.length || 0}/2000 characters
              </p>
            </Card>

            {/* Resume Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Resume Upload *
              </h3>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    {resumeFile ? resumeFile.name : 'Upload your resume'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, or DOCX format • Max 5MB
                  </p>
                </label>
                {resumeUploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${resumeUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploading... {resumeUploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !resumeFile}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default JobApplicationModal; 