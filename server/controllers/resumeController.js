const ResumeAnalysis = require('../models/ResumeAnalysis');
const { parsePDF } = require('../service/pdfParser');
const { parseDOCX } = require('../service/docxParser');
const { analyzeResumeWithML } = require('../service/mlService');
const path = require('path');

// @desc    Upload and analyze resume
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    const file = req.file;
    const { jobDescription } = req.body;

    // Detect file type
    const fileExt = path.extname(file.originalname).toLowerCase();
    let resumeText;
    let fileType;

    // Parse file based on type
    if (fileExt === '.pdf') {
      resumeText = await parsePDF(file.buffer);
      fileType = 'pdf';
    } else if (fileExt === '.docx') {
      resumeText = await parseDOCX(file.buffer);
      fileType = 'docx';
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload PDF or DOCX.' });
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ 
        message: 'Could not extract sufficient text from the resume. Please ensure the file is not corrupted or empty.' 
      });
    }

    // Call ML API for analysis
    const analysisResult = await analyzeResumeWithML(resumeText, jobDescription || '');

    // Save to database
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      fileName: file.originalname,
      fileType: fileType,
      resumeText: resumeText.substring(0, 5000), // Store first 5000 chars
      jobDescription: jobDescription || '',
      analysis: {
        overallScore: analysisResult.overall_score,
        atsScore: analysisResult.ats_score,
        keywordScore: analysisResult.keyword_score,
        skillMatchPercentage: analysisResult.skill_match_percentage,
        matchedSkills: analysisResult.matched_skills,
        missingSkills: analysisResult.missing_skills,
        experienceScore: analysisResult.experience_score,
        suggestions: analysisResult.suggestions,
        extractedKeywords: analysisResult.extracted_keywords,
        scoreBreakdown: analysisResult.score_breakdown,
      },
    });

    res.status(201).json({
      message: 'Resume analyzed successfully',
      data: resumeAnalysis,
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      message: 'Error analyzing resume', 
      error: error.message 
    });
  }
};

// @desc    Get user's resume analysis history
// @route   GET /api/resume/history
// @access  Private
const getAnalysisHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await ResumeAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-resumeText'); // Exclude large text field

    const total = await ResumeAnalysis.countDocuments({ user: req.user._id });

    res.json({
      data: analyses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching analysis history' });
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/resume/analysis/:id
// @access  Private
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({ data: analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
};

// @desc    Delete analysis by ID
// @route   DELETE /api/resume/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    await analysis.deleteOne();

    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Error deleting analysis' });
  }
};

module.exports = {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
};
