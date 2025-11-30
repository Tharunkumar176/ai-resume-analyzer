import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { getAnalysisHistory, deleteAnalysis } from '../services/resumeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAnalysisHistory(page, 10);
      setAnalyses(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteAnalysis(id);
        setAnalyses(analyses.filter((a) => a._id !== id));
      } catch (err) {
        alert('Failed to delete analysis');
      }
    }
  };

  const handleView = (analysis) => {
    navigate('/results', { state: { analysis } });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              View your resume analysis history
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition duration-150"
          >
            Analyze New Resume
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <Loader message="Loading your analysis history..." />
        ) : analyses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No analyses yet
            </h3>
            <p className="mt-2 text-gray-500">
              Upload your first resume to get started
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition duration-150"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {analysis.fileName}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs uppercase">
                        {analysis.fileType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyzed on{' '}
                      {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                      {new Date(analysis.createdAt).toLocaleTimeString()}
                    </p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Overall Score</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.analysis.overallScore
                          )}`}
                        >
                          {analysis.analysis.overallScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ATS Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysis.analysis.atsScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Skills Match</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {analysis.analysis.skillMatchPercentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-2xl font-bold text-green-600">
                          {analysis.analysis.experienceScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleView(analysis)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(analysis._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchHistory(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  pagination.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
