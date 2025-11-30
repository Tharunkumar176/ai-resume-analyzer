import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScoreCard from '../components/ScoreCard';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state?.analysis;

  console.log('ResultPage - Location State:', location.state);
  console.log('ResultPage - Analysis Data:', analysisData);

  if (!analysisData || !analysisData.analysis) {
    console.log('No analysis data found, redirecting to upload');
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Analysis Data Found
            </h2>
            <p className="text-gray-600 mb-6">
              Please upload a resume to see analysis results.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition duration-150"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = analysisData.analysis;
  console.log('ResultPage - Final Data:', data);
  console.log('ResultPage - Overall Score:', data.overallScore);
  console.log('ResultPage - Score Breakdown:', data.scoreBreakdown);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-gray-600">
            Detailed breakdown of your resume performance
          </p>
        </div>

        {/* Overall Score */}
        <div className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-2">Overall Score</h2>
          <div className="text-6xl font-bold">{data.overallScore || 0}%</div>
          <p className="mt-2 text-primary-100">
            {(data.overallScore || 0) >= 80
              ? 'Excellent! Your resume is highly competitive.'
              : (data.overallScore || 0) >= 60
              ? 'Good! A few improvements can make it great.'
              : 'Needs improvement. Check suggestions below.'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Score Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScoreCard
              title="ATS Compatibility"
              score={data.atsScore || 0}
              description="Resume formatting and structure"
              color="blue"
            />
            <ScoreCard
              title="Keyword Match"
              score={data.keywordScore || 0}
              description="Relevance to job description"
              color="green"
            />
            <ScoreCard
              title="Experience Score"
              score={data.experienceScore || 0}
              description="Work history and achievements"
              color="purple"
            />
            <ScoreCard
              title="Education Score"
              score={data.scoreBreakdown?.educationScore || 0}
              description="Educational background"
              color="yellow"
            />
            <ScoreCard
              title="Skills Match"
              score={data.skillMatchPercentage || 0}
              description="Technical and soft skills"
              color="indigo"
            />
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Matched Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">✓</span> Matched Skills
            </h3>
            {data.matchedSkills && data.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No matched skills found</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">!</span> Missing Skills
            </h3>
            {data.missingSkills && data.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Great! No critical skills missing</p>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Extracted Keywords
          </h3>
          {data.extractedKeywords && data.extractedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.extractedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No keywords extracted</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💡 Improvement Suggestions
          </h3>
          {data.suggestions && data.suggestions.length > 0 ? (
            <ul className="space-y-3">
              {data.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No suggestions at this time. Your resume looks great!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition duration-150"
          >
            Analyze Another Resume
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition duration-150"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
