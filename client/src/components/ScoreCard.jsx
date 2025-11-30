const ScoreCard = ({ title, score, description, color = 'blue' }) => {
  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
    };
    return colors[color] || colors.blue;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getColorClasses()}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
        {score}%
      </div>
      {description && (
        <p className="text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

export default ScoreCard;
