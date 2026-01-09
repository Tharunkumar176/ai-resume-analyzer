# AI Resume Analyzer 🚀

A comprehensive full-stack application for analyzing resumes using AI and machine learning. The system provides detailed scoring, skill matching, ATS compatibility analysis, and personalized improvement suggestions.

## 🎯 Features

- **User Authentication**: Secure signup/login with JWT
- **Resume Upload**: Support for PDF and DOCX formats
- **AI-Powered Analysis**: 
  - ATS Compatibility Score
  - Keyword Matching
  - Skills Analysis (matched and missing)
  - Experience Evaluation
  - Education Assessment
- **Detailed Feedback**: Personalized suggestions for improvement
- **Analysis History**: Track and compare multiple resume analyses
- **Modern UI**: Responsive design with Tailwind CSS

## 🏗️ Architecture

The application consists of three main components:

```
ai-resume-analyzer/
├── ml-api/          # Python FastAPI - ML Analysis Service
├── server/          # Node.js Express - Backend API
└── client/          # React + Vite - Frontend UI
```

### Technology Stack

**ML API (Python)**
- FastAPI
- scikit-learn
- sentence-transformers
- spaCy
- numpy

**Backend (Node.js)**
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- pdf-parse & mammoth for file parsing

**Frontend (React)**
- React 18
- React Router
- Vite
- Tailwind CSS
- Axios

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

#### 1. ML API Setup

```bash
cd ml-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Start the ML API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The ML API will be available at `http://localhost:8000`

#### 2. Backend Server Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

The backend server will be available at `http://localhost:5000`

#### 3. Frontend Client Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📝 API Documentation

### ML API Endpoints

- `POST /analyze` - Analyze resume text and return scores
- `GET /health` - Health check
- `GET /` - API information

### Backend API Endpoints

**Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

**Resume Analysis**
- `POST /api/resume/analyze` - Upload and analyze resume (Protected)
- `GET /api/resume/history` - Get analysis history (Protected)
- `GET /api/resume/analysis/:id` - Get specific analysis (Protected)
- `DELETE /api/resume/analysis/:id` - Delete analysis (Protected)

## 🔑 Environment Variables

### ML API (.env)
```
PORT=8000
HOST=0.0.0.0
```

### Backend Server (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
ML_API_URL=http://localhost:8000
```

### Frontend Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Project Structure

### ML API
```
ml-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── analyzer.py          # Analysis logic
│   ├── models.py            # Pydantic models
│   └── utils.py             # Utility functions
├── requirements.txt
└── README.md
```

### Backend Server
```
server/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── resumeController.js # Resume handling logic
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   └── uploadMiddleware.js # File upload handling
├── models/
│   ├── User.js             # User schema
│   └── ResumeAnalysis.js   # Analysis schema
├── routes/
│   ├── authRoutes.js       # Auth routes
│   └── resumeRoutes.js     # Resume routes
├── service/
│   ├── pdfParser.js        # PDF text extraction
│   ├── docxParser.js       # DOCX text extraction
│   └── mlService.js        # ML API integration
├── server.js               # Express app
└── package.json
```

### Frontend Client
```
client/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ScoreCard.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── ResultPage.jsx
│   │   ├── Signup.jsx
│   │   └── UploadResume.jsx
│   ├── services/
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js  # Auth API calls
│   │   └── resumeService.js # Resume API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🔄 Application Flow

1. **User Registration/Login**
   - User signs up or logs in through the React frontend
   - Backend validates credentials and returns JWT token
   - Token is stored in localStorage for subsequent requests

2. **Resume Upload**
   - User uploads PDF/DOCX resume file
   - Optional: Add job description for targeted analysis
   - Frontend sends multipart form data to backend

3. **File Processing**
   - Backend receives file via Multer middleware
   - File type detection (PDF/DOCX)
   - Text extraction using pdf-parse or mammoth
   - Validation of extracted text

4. **ML Analysis**
   - Backend sends extracted text to ML API
   - ML API performs comprehensive analysis:
     - ATS compatibility scoring
     - Keyword extraction and matching
     - Skills detection and matching
     - Experience evaluation
     - Education assessment
     - Suggestion generation
   - Returns structured JSON response

5. **Data Storage**
   - Backend saves analysis results to MongoDB
   - Associates data with user account
   - Returns response to frontend

6. **Results Display**
   - Frontend displays comprehensive analysis:
     - Overall score with color-coded cards
     - Score breakdown (ATS, keywords, skills, experience, education)
     - Matched and missing skills
     - Extracted keywords
     - Improvement suggestions

7. **History Management**
   - Users can view past analyses on Dashboard
   - Filter, sort, and delete old analyses
   - Re-view detailed results anytime

## 🧪 Testing

### Test ML API
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Experienced Software Engineer with 5 years in Python, JavaScript, React, Node.js...",
    "job_description": "Looking for a Full Stack Developer with React and Node.js experience..."
  }'
```

### Test Backend API
```bash
# Signup
curl -X POST "http://localhost:5000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🛠️ Development

### Running in Development Mode

Start all three services in separate terminals:

```bash
# Terminal 1 - ML API
cd ml-api
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Backend
cd server
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

## 📦 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Deploy ML API
- Use services like AWS EC2, Google Cloud Run, or Heroku
- Ensure Python 3.8+ is installed
- Set up environment variables
- Use gunicorn or uvicorn for production

### Deploy Backend
- Deploy to AWS, Heroku, or DigitalOcean
- Use MongoDB Atlas for cloud database
- Set NODE_ENV=production
- Configure CORS for production domains

### Deploy Frontend
- Use Vercel, Netlify, or AWS S3 + CloudFront
- Update VITE_API_URL to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using React, Node.js, FastAPI, and MongoDB
# ai-resume-analyzer
