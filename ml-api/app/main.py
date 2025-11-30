from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import ResumeAnalysisRequest, ResumeAnalysisResponse
from app.analyzer import analyze_resume
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Analyzer API",
    description="ML-powered resume analysis and scoring system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Resume Analyzer API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume_endpoint(request: ResumeAnalysisRequest):
    """
    Analyze resume and return comprehensive scoring and suggestions
    """
    try:
        # Validate input
        if not request.resume_text or len(request.resume_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume text is too short. Please provide a complete resume."
            )
        
        logger.info(f"Analyzing resume with {len(request.resume_text)} characters")
        
        # Perform analysis
        analysis_result = analyze_resume(
            resume_text=request.resume_text,
            job_description=request.job_description or ""
        )
        
        logger.info(f"Analysis complete. Overall score: {analysis_result.overall_score}")
        
        return analysis_result
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing resume: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
