# AI Resume Analyzer - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                        │
│                        http://localhost:3000                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Login   │  │  Signup  │  │Dashboard │  │  Upload  │           │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │             │              │             │                   │
│       └─────────────┴──────────────┴─────────────┘                   │
│                          │                                           │
│                    ┌─────▼─────┐                                    │
│                    │  Services  │                                    │
│                    │  (Axios)   │                                    │
│                    └─────┬─────┘                                    │
│                          │                                           │
└──────────────────────────┼───────────────────────────────────────────┘
                           │ HTTP/REST
                           │
┌──────────────────────────▼───────────────────────────────────────────┐
│                    SERVER (Node.js Express)                          │
│                      http://localhost:5000                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐              ┌─────────────────┐              │
│  │  Auth Routes    │              │  Resume Routes  │              │
│  │  /api/auth/*    │              │  /api/resume/*  │              │
│  └────────┬────────┘              └────────┬────────┘              │
│           │                                 │                        │
│           ▼                                 ▼                        │
│  ┌─────────────────┐              ┌─────────────────┐              │
│  │     Auth        │              │    Resume       │              │
│  │   Controller    │              │   Controller    │              │
│  └────────┬────────┘              └────────┬────────┘              │
│           │                                 │                        │
│           │                        ┌────────▼────────┐              │
│           │                        │  File Parsers   │              │
│           │                        │  (PDF/DOCX)     │              │
│           │                        └────────┬────────┘              │
│           │                                 │                        │
│           │                        ┌────────▼────────┐              │
│           │                        │   ML Service    │              │
│           │                        │  (Axios Call)   │              │
│           │                        └────────┬────────┘              │
│           │                                 │                        │
│           ▼                                 │                        │
│  ┌────────────────────────────────────────┐│                       │
│  │          MongoDB (Mongoose)            ││                       │
│  │  - users collection                    ││                       │
│  │  - resumeanalyses collection           ││                       │
│  └────────────────────────────────────────┘│                       │
│                                             │                        │
└─────────────────────────────────────────────┼────────────────────────┘
                                              │ HTTP/REST
                                              │
┌─────────────────────────────────────────────▼────────────────────────┐
│                      ML API (Python FastAPI)                         │
│                       http://localhost:8000                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │                    POST /analyze                         │       │
│  │              (Pydantic Models & Validation)             │       │
│  └──────────────────────────┬──────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │                     analyzer.py                          │       │
│  │  - calculate_ats_score()                                 │       │
│  │  - generate_suggestions()                                │       │
│  │  - analyze_resume() [Main Function]                      │       │
│  └──────────────────────────┬──────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │                       utils.py                           │       │
│  │  - extract_keywords()                                    │       │
│  │  - extract_skills_from_text()                            │       │
│  │  - match_skills()                                        │       │
│  │  - calculate_keyword_match()                             │       │
│  │  - calculate_experience_score()                          │       │
│  │  - calculate_education_score()                           │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌────────────┐
│   USER     │
└─────┬──────┘
      │ 1. Upload Resume (PDF/DOCX)
      │    + Job Description (optional)
      ▼
┌────────────────────────────────────────┐
│  REACT FRONTEND (Port 3000)            │
│  Components: FileUpload, UploadResume  │
└─────┬──────────────────────────────────┘
      │ 2. POST /api/resume/analyze
      │    FormData (file + jobDescription)
      ▼
┌────────────────────────────────────────┐
│  EXPRESS BACKEND (Port 5000)           │
│  - Auth Middleware (JWT validation)    │
│  - Upload Middleware (Multer)          │
└─────┬──────────────────────────────────┘
      │ 3. Extract Text
      │    - PDF → pdf-parse
      │    - DOCX → mammoth
      ▼
┌────────────────────────────────────────┐
│  TEXT EXTRACTION                       │
│  resumeText: "John Doe..."             │
└─────┬──────────────────────────────────┘
      │ 4. POST /analyze
      │    { resume_text, job_description }
      ▼
┌────────────────────────────────────────┐
│  FASTAPI ML SERVICE (Port 8000)        │
│  - NLP Analysis                        │
│  - Scoring Algorithms                  │
│  - Skill Matching                      │
└─────┬──────────────────────────────────┘
      │ 5. Return Analysis Result
      │    {
      │      overall_score: 85.5,
      │      ats_score: 90,
      │      matched_skills: [...],
      │      suggestions: [...]
      │    }
      ▼
┌────────────────────────────────────────┐
│  EXPRESS BACKEND                       │
│  - Save to MongoDB                     │
│  - Associate with User                 │
└─────┬──────────────────────────────────┘
      │ 6. Return Response
      │    { message, data }
      ▼
┌────────────────────────────────────────┐
│  REACT FRONTEND                        │
│  - Navigate to ResultPage              │
│  - Display Scores                      │
│  - Show Suggestions                    │
└─────┬──────────────────────────────────┘
      │ 7. View Results
      ▼
┌────────────┐
│   USER     │
└────────────┘
```

## Component Interaction

```
Frontend Components:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Login     │────▶│   Dashboard  │────▶│    Upload    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                     │
       │                    │                     │
       ▼                    ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ authService  │     │resumeService │     │ FileUpload   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       │                    │                     │
       └────────────────────┴─────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   api.js     │
                    │   (Axios)    │
                    └──────────────┘

Backend Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Routes     │────▶│ Controllers  │────▶│  Services    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            ▼                     ▼
                    ┌──────────────┐     ┌──────────────┐
                    │  Middleware  │     │   Models     │
                    └──────────────┘     └──────────────┘

ML API Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    main.py   │────▶│ analyzer.py  │────▶│   utils.py   │
│  (FastAPI)   │     │  (Logic)     │     │  (Helpers)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                           │
       └───────────────────┬───────────────────────┘
                           ▼
                   ┌──────────────┐
                   │  models.py   │
                   │ (Pydantic)   │
                   └──────────────┘
```

## File Organization

```
ml-api/
├── app/
│   ├── main.py         ──────┐ Entry point, routes
│   ├── analyzer.py     ──────┤ Core logic
│   ├── models.py       ──────┤ Data models
│   └── utils.py        ──────┘ Utilities
└── requirements.txt

server/
├── config/db.js        ────── Database connection
├── controllers/        ────── Business logic
├── middleware/         ────── Request processing
├── models/             ────── Data schemas
├── routes/             ────── API endpoints
├── service/            ────── External services
└── server.js           ────── App initialization

client/
├── src/
│   ├── components/     ────── Reusable UI
│   ├── pages/          ────── Route pages
│   ├── services/       ────── API calls
│   ├── hooks/          ────── Custom hooks
│   └── App.jsx         ────── Router setup
└── index.html
```

## Database Schema

```
MongoDB Collections:

┌─────────────────────────────────────────┐
│           users                         │
├─────────────────────────────────────────┤
│ _id: ObjectId                           │
│ name: String                            │
│ email: String (unique)                  │
│ password: String (hashed)               │
│ role: String (enum: user, admin)       │
│ isActive: Boolean                       │
│ createdAt: Date                         │
│ updatedAt: Date                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       resumeanalyses                    │
├─────────────────────────────────────────┤
│ _id: ObjectId                           │
│ user: ObjectId (ref: users)             │
│ fileName: String                        │
│ fileType: String (pdf/docx)             │
│ resumeText: String                      │
│ jobDescription: String                  │
│ analysis: {                             │
│   overallScore: Number                  │
│   atsScore: Number                      │
│   keywordScore: Number                  │
│   skillMatchPercentage: Number          │
│   matchedSkills: [String]               │
│   missingSkills: [String]               │
│   experienceScore: Number               │
│   suggestions: [String]                 │
│   extractedKeywords: [String]           │
│   scoreBreakdown: {                     │
│     atsScore: Number                    │
│     keywordScore: Number                │
│     experienceScore: Number             │
│     educationScore: Number              │
│     skillsScore: Number                 │
│   }                                     │
│ }                                       │
│ createdAt: Date                         │
│ updatedAt: Date                         │
└─────────────────────────────────────────┘
```

## Authentication Flow

```
┌────────────┐
│   Client   │
└─────┬──────┘
      │ POST /api/auth/signup
      │ { name, email, password }
      ▼
┌─────────────────────────────┐
│  Auth Controller            │
│  - Hash password (bcrypt)   │
│  - Create user in DB        │
│  - Generate JWT token       │
└─────┬───────────────────────┘
      │ { user, token }
      ▼
┌────────────┐
│   Client   │ Store token in localStorage
└─────┬──────┘
      │ All subsequent requests
      │ Authorization: Bearer <token>
      ▼
┌─────────────────────────────┐
│  Auth Middleware            │
│  - Verify JWT               │
│  - Extract user ID          │
│  - Attach user to request   │
└─────┬───────────────────────┘
      │ req.user = user
      ▼
┌─────────────────────────────┐
│  Protected Routes           │
│  - Access req.user          │
└─────────────────────────────┘
```

## Scoring Algorithm

```
Resume Analysis Pipeline:

Input: resume_text + job_description
│
├─► ATS Score (25% weight)
│   ├─ Contact info check (email, phone)
│   ├─ Section structure (experience, education, skills)
│   ├─ Formatting (bullet points, length)
│   └─► Score: 0-100
│
├─► Keyword Score (20% weight)
│   ├─ Extract resume keywords
│   ├─ Extract JD keywords
│   ├─ Calculate overlap
│   └─► Score: 0-100
│
├─► Skills Score (25% weight)
│   ├─ Detect technical skills
│   ├─ Match with JD skills
│   ├─ Identify missing skills
│   └─► Score: 0-100
│
├─► Experience Score (15% weight)
│   ├─ Extract years of experience
│   ├─ Evaluate against requirements
│   └─► Score: 0-100
│
├─► Education Score (15% weight)
│   ├─ Detect education section
│   ├─ Identify degrees
│   └─► Score: 0-100
│
└─► Overall Score
    = (ATS * 0.25) + (Keyword * 0.20) + 
      (Skills * 0.25) + (Experience * 0.15) + 
      (Education * 0.15)
```
