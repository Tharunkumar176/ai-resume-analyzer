# ML API - Resume Analyzer

FastAPI-based machine learning service for resume analysis.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /analyze` - Analyze resume and get scores
- `GET /health` - Health check
- `GET /` - API info

## Testing

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Your resume text here", "job_description": "Job description"}'
```
