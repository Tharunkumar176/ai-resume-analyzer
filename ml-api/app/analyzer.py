import re
from typing import List, Tuple
from app.utils import (
    extract_keywords,
    match_skills,
    calculate_keyword_match,
    calculate_experience_score,
    calculate_education_score
)
from app.models import ResumeAnalysisResponse, ScoreBreakdown

def calculate_ats_score(resume_text: str) -> float:
    """
    Calculate ATS (Applicant Tracking System) compatibility score
    Based on formatting, structure, and readability
    """
    score = 0
    max_score = 100
    
    # Check for contact information (10 points each)
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    
    if re.search(email_pattern, resume_text):
        score += 10
    if re.search(phone_pattern, resume_text):
        score += 10
    
    # Check for common resume sections (5 points each, max 30 points)
    # Using more strict patterns - looking for section headers
    text_lower = resume_text.lower()
    section_patterns = [
        (r'\b(work\s+)?experience\b', 'experience'),
        (r'\beducation\b', 'education'),
        (r'\b(technical\s+)?skills\b', 'skills'),
        (r'\bprojects?\b', 'projects'),
        (r'\b(professional\s+)?(summary|objective|profile)\b', 'summary'),
        (r'\bcertifications?\b', 'certifications')
    ]
    
    found_sections = 0
    for pattern, name in section_patterns:
        if re.search(pattern, text_lower):
            found_sections += 1
    
    score += min(found_sections * 5, 30)
    
    # Check for bullet points or list formatting (15 points)
    # Count actual bullet point usage, not just presence
    bullet_patterns = [
        r'^\s*[\•\-\*]\s+\w+',  # Bullet at start of line
        r'\n\s*[\•\-\*]\s+\w+'   # Bullet after newline
    ]
    bullet_count = 0
    for pattern in bullet_patterns:
        bullet_count += len(re.findall(pattern, resume_text, re.MULTILINE))
    
    if bullet_count >= 10:
        score += 15
    elif bullet_count >= 5:
        score += 10
    elif bullet_count >= 2:
        score += 5
    
    # Check for action verbs (15 points)
    action_verbs = [
        'developed', 'created', 'implemented', 'designed', 'built', 'managed',
        'led', 'improved', 'achieved', 'increased', 'reduced', 'optimized',
        'collaborated', 'coordinated', 'executed', 'established', 'launched',
        'maintained', 'analyzed', 'architected', 'automated', 'delivered'
    ]
    found_verbs = sum(1 for verb in action_verbs if verb in text_lower)
    
    if found_verbs >= 8:
        score += 15
    elif found_verbs >= 5:
        score += 10
    elif found_verbs >= 3:
        score += 5
    
    # Check for quantifiable achievements (10 points)
    # Look for numbers/percentages indicating metrics
    metric_patterns = [
        r'\d+%',  # Percentages
        r'\$\d+',  # Dollar amounts
        r'\d+\+?\s*(users|clients|customers|projects|years|months)',  # User counts, time
        r'\d+[kKmMbB]\+?',  # Numbers with K, M, B suffix
    ]
    metric_count = sum(len(re.findall(pattern, resume_text)) for pattern in metric_patterns)
    
    if metric_count >= 5:
        score += 10
    elif metric_count >= 3:
        score += 7
    elif metric_count >= 1:
        score += 4
    
    # Check text length and structure (10 points)
    word_count = len(resume_text.split())
    if 300 <= word_count <= 1500:
        score += 10
    elif 200 <= word_count < 300 or 1500 < word_count <= 2000:
        score += 7
    elif 150 <= word_count < 200 or 2000 < word_count <= 2500:
        score += 4
    
    # Check for professional formatting (10 points)
    # Proper capitalization, not all caps or all lowercase
    lines = resume_text.split('\n')
    proper_case_lines = sum(1 for line in lines if line and line[0].isupper() and not line.isupper())
    
    if proper_case_lines >= 10:
        score += 10
    elif proper_case_lines >= 5:
        score += 6
    elif proper_case_lines >= 2:
        score += 3
    
    return min(score, max_score)

def generate_suggestions(
    resume_text: str,
    ats_score: float,
    keyword_score: float,
    skill_match_percentage: float,
    missing_skills: List[str],
    experience_score: float
) -> List[str]:
    """
    Generate personalized suggestions for resume improvement
    """
    suggestions = []
    
    # ATS Score suggestions
    if ats_score < 50:
        suggestions.append("Add clear section headers like 'EXPERIENCE', 'EDUCATION', 'SKILLS', and 'PROJECTS'")
        suggestions.append("Include contact information (email and phone) at the top of your resume")
        suggestions.append("Use bullet points (•, -, *) to organize your achievements - aim for 10+ bullet points")
        suggestions.append("Start bullet points with strong action verbs like 'developed', 'implemented', 'led'")
    elif ats_score < 70:
        suggestions.append("Add more bullet points to your experience section - aim for 3-5 per job")
        suggestions.append("Include quantifiable achievements with numbers (e.g., 'improved performance by 40%')")
        suggestions.append("Use more action verbs to describe your accomplishments")
    elif ats_score < 85:
        suggestions.append("Enhance your resume with specific metrics and numbers in your achievements")
        suggestions.append("Ensure proper formatting with clear section headers and consistent capitalization")
    
    # Keyword suggestions
    if keyword_score < 60:
        suggestions.append("Increase keyword match by incorporating more relevant terms from the job description")
        suggestions.append("Use industry-specific terminology and action verbs in your descriptions")
    elif keyword_score < 80:
        suggestions.append("Fine-tune your resume by adding more keywords from the target role")
    
    # Skills suggestions
    if skill_match_percentage < 50:
        if missing_skills:
            top_missing = missing_skills[:5]
            suggestions.append(f"Consider acquiring these in-demand skills: {', '.join(top_missing)}")
        suggestions.append("Highlight your technical skills more prominently in a dedicated Skills section")
    elif skill_match_percentage < 75:
        if missing_skills:
            suggestions.append(f"Strengthen your profile by learning: {', '.join(missing_skills[:3])}")
    
    # Experience suggestions
    if experience_score < 70:
        suggestions.append("Add more details about your work experience, including specific achievements and metrics")
        suggestions.append("Quantify your accomplishments with numbers, percentages, or specific outcomes")
    
    # General suggestions
    if not re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
        suggestions.append("Add a professional email address to your contact information")
    
    # Check for action verbs
    action_verbs = ['developed', 'managed', 'led', 'created', 'implemented', 'designed', 'improved', 'achieved']
    if not any(verb in resume_text.lower() for verb in action_verbs):
        suggestions.append("Use strong action verbs like 'developed', 'managed', 'led', and 'implemented' to describe your experience")
    
    # Education check
    education_keywords = ['bachelor', 'master', 'degree', 'university', 'college']
    if not any(keyword in resume_text.lower() for keyword in education_keywords):
        suggestions.append("Include your educational background with degree, institution, and graduation year")
    
    # Projects suggestion
    if 'project' not in resume_text.lower():
        suggestions.append("Add a Projects section to showcase your practical experience and technical skills")
    
    # Keep only unique suggestions and limit to top 8
    suggestions = list(dict.fromkeys(suggestions))[:8]
    
    if not suggestions:
        suggestions.append("Your resume looks great! Keep it updated with your latest achievements.")
    
    return suggestions

def analyze_resume(resume_text: str, job_description: str = "") -> ResumeAnalysisResponse:
    """
    Main function to analyze resume and return comprehensive results
    """
    # Calculate individual scores
    ats_score = calculate_ats_score(resume_text)
    keyword_score = calculate_keyword_match(resume_text, job_description)
    experience_score = calculate_experience_score(resume_text)
    education_score = calculate_education_score(resume_text)
    
    # Extract skills and calculate match
    matched_skills, missing_skills, skill_match_percentage = match_skills(resume_text, job_description)
    skills_score = skill_match_percentage
    
    # Extract keywords
    extracted_keywords = extract_keywords(resume_text, 15)
    
    # Calculate overall score (weighted average)
    overall_score = (
        ats_score * 0.25 +
        keyword_score * 0.20 +
        skills_score * 0.25 +
        experience_score * 0.15 +
        education_score * 0.15
    )
    
    # Generate suggestions
    suggestions = generate_suggestions(
        resume_text,
        ats_score,
        keyword_score,
        skill_match_percentage,
        missing_skills,
        experience_score
    )
    
    # Create score breakdown
    score_breakdown = ScoreBreakdown(
        ats_score=round(ats_score, 2),
        keyword_score=round(keyword_score, 2),
        experience_score=round(experience_score, 2),
        education_score=round(education_score, 2),
        skills_score=round(skills_score, 2)
    )
    
    # Create response
    response = ResumeAnalysisResponse(
        overall_score=round(overall_score, 2),
        ats_score=round(ats_score, 2),
        keyword_score=round(keyword_score, 2),
        skill_match_percentage=round(skill_match_percentage, 2),
        matched_skills=matched_skills[:20],  # Limit to top 20
        missing_skills=missing_skills[:15],   # Limit to top 15
        experience_score=round(experience_score, 2),
        suggestions=suggestions,
        extracted_keywords=extracted_keywords,
        score_breakdown=score_breakdown
    )
    
    return response
