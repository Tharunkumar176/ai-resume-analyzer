const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    analysis: {
      overallScore: {
        type: Number,
        required: true,
      },
      atsScore: {
        type: Number,
        required: true,
      },
      keywordScore: {
        type: Number,
        required: true,
      },
      skillMatchPercentage: {
        type: Number,
        required: true,
      },
      matchedSkills: [String],
      missingSkills: [String],
      experienceScore: {
        type: Number,
        required: true,
      },
      suggestions: [String],
      extractedKeywords: [String],
      scoreBreakdown: {
        atsScore: Number,
        keywordScore: Number,
        experienceScore: Number,
        educationScore: Number,
        skillsScore: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
