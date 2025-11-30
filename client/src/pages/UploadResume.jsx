import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import { analyzeResume } from '../services/resumeService';

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await analyzeResume(formData);
      
      console.log('Analysis Response:', response);
      console.log('Response Data:', response.data);
      
      // Navigate to results page with analysis data
      navigate('/results', { state: { analysis: response.data } });
    } catch (err) {
      console.error('Analysis Error:', err);
      console.error('Error Response:', err.response);
      setError(
        err.response?.data?.message || 
        'Failed to analyze resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your resume in PDF or DOCX format to get AI-powered analysis and feedback
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume File *
              </label>
              <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Job Description (Optional)
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Paste the job description here to get more targeted feedback..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Adding a job description helps us provide more specific suggestions
              </p>
            </div>

            {loading ? (
              <Loader message="Analyzing your resume... This may take a few moments." />
            ) : (
              <button
                type="submit"
                disabled={!file}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                Analyze Resume
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
