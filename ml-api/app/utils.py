import re
from typing import List, Set, Tuple
import numpy as np

# Common technical skills database
TECHNICAL_SKILLS = {
    'languages': ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab'],
    'frameworks': ['react', 'angular', 'vue', 'django', 'flask', 'fastapi', 'express', 'spring', 'nodejs', 'node.js', 'next.js', 'nuxt', 'svelte', 'laravel', 'rails'],
    'databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'oracle', 'sql server', 'sqlite', 'elasticsearch'],
    'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'docker', 'kubernetes', 'terraform'],
    'tools': ['git', 'github', 'gitlab', 'jenkins', 'circleci', 'jira', 'confluence', 'webpack', 'babel', 'eslint'],
    'ml_ai': ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'opencv', 'nlp', 'machine learning', 'deep learning', 'neural networks'],
    'other': ['rest api', 'graphql', 'microservices', 'agile', 'scrum', 'ci/cd', 'tdd', 'oauth', 'jwt', 'websockets']
}

def get_all_skills() -> Set[str]:
    """Get all available technical skills"""
    all_skills = set()
    for category in TECHNICAL_SKILLS.values():
        all_skills.update(category)
    return all_skills

def extract_keywords(text: str, top_n: int = 20) -> List[str]:
    """
    Extract important keywords from text using frequency analysis
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-z0-9\s\.\+\#]', ' ', text)
    
    # Common stop words to filter out
    stop_words = {
        'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were',
        'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
        'could', 'may', 'might', 'must', 'can', 'of', 'to', 'for', 'with', 'in', 'from',
        'by', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
        'between', 'under', 'over', 'out', 'up', 'down', 'off', 'than', 'or', 'but', 'not',
        'if', 'then', 'else', 'when', 'where', 'who', 'what', 'why', 'how', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their',
        'my', 'your', 'his', 'her', 'its', 'our', 'etc', 'including'
    }
    
    # Split into words and phrases
    words = text.split()
    
    # Count word frequency
    word_freq = {}
    for word in words:
        word = word.strip()
        if len(word) > 2 and word not in stop_words:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Sort by frequency and get top N
    sorted_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    keywords = [word for word, freq in sorted_keywords[:top_n]]
    
    return keywords

def extract_skills_from_text(text: str) -> Set[str]:
    """
    Extract technical skills from text
    """
    text_lower = text.lower()
    found_skills = set()
    
    all_skills = get_all_skills()
    
    for skill in all_skills:
        # Use word boundary to match whole words
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    
    return found_skills

def match_skills(resume_text: str, job_description: str) -> Tuple[List[str], List[str], float]:
    """
    Match skills between resume and job description
    Returns: (matched_skills, missing_skills, match_percentage)
    """
    resume_skills = extract_skills_from_text(resume_text)
    
    if job_description:
        jd_skills = extract_skills_from_text(job_description)
    else:
        # If no job description, use all known skills as reference
        jd_skills = get_all_skills()
    
    matched_skills = list(resume_skills.intersection(jd_skills))
    missing_skills = list(jd_skills - resume_skills)
    
    # Limit missing skills to most relevant ones (if too many)
    if len(missing_skills) > 15:
        missing_skills = missing_skills[:15]
    
    # Calculate match percentage
    if jd_skills:
        match_percentage = (len(matched_skills) / len(jd_skills)) * 100
    else:
        match_percentage = 0
    
    return matched_skills, missing_skills, match_percentage

def calculate_keyword_match(resume_text: str, job_description: str) -> float:
    """
    Calculate keyword match score between resume and job description
    """
    if not job_description:
        return 75.0  # Default score if no job description
    
    resume_keywords = set(extract_keywords(resume_text, 30))
    jd_keywords = set(extract_keywords(job_description, 30))
    
    if not jd_keywords:
        return 75.0
    
    common_keywords = resume_keywords.intersection(jd_keywords)
    match_score = (len(common_keywords) / len(jd_keywords)) * 100
    
    return min(match_score, 100)

def extract_experience_years(text: str) -> float:
    """
    Extract years of experience from resume text
    """
    # Look for patterns like "X years", "X+ years", "X-Y years"
    patterns = [
        r'(\d+)\+?\s*years?',
        r'(\d+)\s*-\s*\d+\s*years?',
        r'experience[:\s]+(\d+)\s*years?'
    ]
    
    years = []
    for pattern in patterns:
        matches = re.findall(pattern, text.lower())
        years.extend([int(match) for match in matches])
    
    if years:
        return max(years)
    
    return 0

def calculate_experience_score(resume_text: str) -> float:
    """
    Calculate experience score based on years mentioned
    """
    years = extract_experience_years(resume_text)
    
    if years == 0:
        return 50.0  # Default score if no experience found
    elif years < 2:
        return 60.0
    elif years < 5:
        return 75.0
    elif years < 10:
        return 85.0
    else:
        return 95.0

def detect_education(text: str) -> bool:
    """
    Detect education section in resume
    """
    education_keywords = [
        'bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'b.e', 'm.e',
        'bsc', 'msc', 'mba', 'degree', 'university', 'college', 'education'
    ]
    
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in education_keywords)

def calculate_education_score(resume_text: str) -> float:
    """
    Calculate education score
    """
    has_education = detect_education(resume_text)
    return 85.0 if has_education else 50.0
