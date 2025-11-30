# Testing Guide - AI Resume Analyzer

This guide provides comprehensive testing instructions for all components of the AI Resume Analyzer.

## 🧪 Testing Overview

The application consists of three layers, each with its own testing approach:
1. **ML API** (Python FastAPI) - Unit and integration tests
2. **Backend Server** (Node.js Express) - API endpoint tests
3. **Frontend Client** (React) - UI and integration tests

## Prerequisites for Testing

Ensure all services are running:
```bash
./start.sh
```

Or start individually:
```bash
# Terminal 1 - ML API
cd ml-api && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2 - Backend
cd server && npm run dev

# Terminal 3 - Frontend
cd client && npm run dev
```

## 1. ML API Testing (Port 8000)

### Manual Testing with cURL

#### Test Health Check
```bash
curl http://localhost:8000/health
```

Expected Response:
```json
{"status": "healthy"}
```

#### Test Root Endpoint
```bash
curl http://localhost:8000/
```

Expected Response:
```json
{
  "message": "AI Resume Analyzer API",
  "version": "1.0.0",
  "status": "active"
}
```

#### Test Resume Analysis - Basic
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Software Engineer with 5 years of experience in Python, JavaScript, React, Node.js, MongoDB. Developed web applications using Django and Flask. Experience with AWS, Docker, and Git.",
    "job_description": "Looking for a Full Stack Developer with experience in React, Node.js, Python, and MongoDB."
  }'
```

Expected Response (partial):
```json
{
  "overall_score": 85.2,
  "ats_score": 75.0,
  "keyword_score": 82.5,
  "skill_match_percentage": 95.0,
  "matched_skills": ["python", "javascript", "react", "nodejs", "mongodb"],
  "missing_skills": [],
  "experience_score": 85.0,
  "suggestions": [...]
}
```

#### Test Resume Analysis - Minimal Resume
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Fresh graduate with basic programming knowledge.",
    "job_description": ""
  }'
```

#### Test Error Handling - Empty Resume
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "",
    "job_description": ""
  }'
```

Expected: 400 error

### Interactive Testing

Visit: http://localhost:8000/docs

This opens FastAPI's Swagger UI where you can:
- View all endpoints
- Test endpoints interactively
- View request/response schemas

## 2. Backend Server Testing (Port 5000)

### A. Authentication Tests

#### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Save the token for subsequent requests!**

#### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test Profile (Protected Route)
```bash
# Replace YOUR_TOKEN with the token from signup/login
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected Response:
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "createdAt": "..."
}
```

#### Test Invalid Token
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer invalid_token_here"
```

Expected: 401 Unauthorized

### B. Resume Analysis Tests

#### Test File Upload and Analysis
```bash
# Create a sample resume file first
echo "John Doe
Email: john@example.com
Phone: (555) 123-4567

EXPERIENCE
Software Engineer at Tech Company (2018-2023)
- Developed web applications using React and Node.js
- Implemented RESTful APIs with Express
- Worked with MongoDB and PostgreSQL

SKILLS
Python, JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, Git, Docker, AWS

EDUCATION
Bachelor of Science in Computer Science
University Name, 2018" > sample_resume.txt

# Convert to PDF (if you have a tool) or use this text file
# For actual testing, use a real PDF or DOCX file

# Upload with curl (multipart form data)
curl -X POST http://localhost:5000/api/resume/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@path/to/resume.pdf" \
  -F "jobDescription=Looking for a Full Stack Developer with React and Node.js experience"
```

#### Test Get Analysis History
```bash
curl http://localhost:5000/api/resume/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Get Single Analysis
```bash
# Replace ANALYSIS_ID with an actual analysis ID from history
curl http://localhost:5000/api/resume/analysis/ANALYSIS_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Delete Analysis
```bash
curl -X DELETE http://localhost:5000/api/resume/analysis/ANALYSIS_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### C. Error Handling Tests

#### Test File Size Limit (> 5MB)
```bash
# Create a large file
dd if=/dev/zero of=large_file.pdf bs=1M count=6

curl -X POST http://localhost:5000/api/resume/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@large_file.pdf"
```

Expected: 400 error about file size

#### Test Invalid File Type
```bash
echo "test" > test.txt
curl -X POST http://localhost:5000/api/resume/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@test.txt"
```

Expected: 400 error about file type

## 3. Frontend Testing (Port 3000)

### Manual UI Testing

#### A. Authentication Flow

1. **Signup Test**
   - Navigate to: http://localhost:3000/signup
   - Fill in:
     - Name: Test User
     - Email: testuser@example.com
     - Password: password123
     - Confirm Password: password123
   - Click "Sign up"
   - Expected: Redirect to Dashboard

2. **Login Test**
   - Navigate to: http://localhost:3000/login
   - Fill in:
     - Email: testuser@example.com
     - Password: password123
   - Click "Sign in"
   - Expected: Redirect to Dashboard

3. **Protected Route Test**
   - Logout (click Logout button)
   - Try to access: http://localhost:3000/dashboard
   - Expected: Redirect to Login page

#### B. Resume Upload Flow

1. **File Upload Test**
   - Login and navigate to: http://localhost:3000/upload
   - Drag and drop a PDF/DOCX resume file
   - OR click to browse and select file
   - Expected: File name and size displayed

2. **File Validation Test**
   - Try uploading a .txt or .jpg file
   - Expected: Error message "Only PDF and DOCX files are allowed"

3. **Analysis Test**
   - Upload a valid resume
   - Optionally add job description
   - Click "Analyze Resume"
   - Expected: 
     - Loading indicator appears
     - Redirect to Results page
     - Scores and suggestions displayed

#### C. Results Display Test

1. **Score Display**
   - Verify Overall Score is shown prominently
   - Check all score cards (ATS, Keywords, Skills, Experience, Education)
   - Verify color coding (green > 80, yellow 60-80, red < 60)

2. **Skills Display**
   - Check Matched Skills (green pills)
   - Check Missing Skills (orange pills)
   - Verify skills are relevant

3. **Suggestions Display**
   - Verify improvement suggestions are shown
   - Check suggestions are actionable

#### D. Dashboard Test

1. **History Display**
   - Navigate to: http://localhost:3000/dashboard
   - Verify list of previous analyses
   - Check each analysis shows:
     - File name
     - Date and time
     - Score preview

2. **View Details**
   - Click "View Details" on any analysis
   - Expected: Navigate to full results page

3. **Delete Analysis**
   - Click "Delete" on any analysis
   - Confirm deletion
   - Expected: Analysis removed from list

### Browser Testing

Test in multiple browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Responsive Design Testing

Test at different screen sizes:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 4. Integration Testing

### Complete End-to-End Flow

1. **Start fresh**
   ```bash
   # Clear browser localStorage
   # Or use incognito mode
   ```

2. **Create account**
   - Go to http://localhost:3000/signup
   - Create new account
   - Verify redirect to dashboard

3. **Upload first resume**
   - Click "Upload Resume" or "Analyze New Resume"
   - Upload a real resume file
   - Add job description
   - Click "Analyze"

4. **Verify analysis**
   - Wait for processing
   - Check all scores are displayed
   - Verify matched/missing skills make sense
   - Read suggestions

5. **Check dashboard**
   - Go back to Dashboard
   - Verify the analysis appears in history
   - Check scores match

6. **Upload second resume**
   - Upload another resume (different content)
   - Verify both analyses appear in history

7. **View and delete**
   - View details of first analysis
   - Go back to dashboard
   - Delete second analysis
   - Verify only first remains

8. **Logout and login**
   - Logout
   - Login again
   - Verify history is preserved

## 5. Performance Testing

### Load Testing (Optional)

#### Test ML API Performance
```bash
# Install Apache Bench (ab)
# Test 100 requests with 10 concurrent
ab -n 100 -c 10 -p resume_data.json -T "application/json" http://localhost:8000/analyze
```

#### Monitor Response Times
- ML API should respond < 5 seconds
- Backend API should respond < 1 second
- Frontend pages should load < 2 seconds

## 6. Database Testing

### MongoDB Verification

```bash
# Connect to MongoDB
mongosh

# Switch to database
use resume-analyzer

# Check collections
show collections

# Count users
db.users.countDocuments()

# View sample user
db.users.findOne()

# Count analyses
db.resumeanalyses.countDocuments()

# View sample analysis
db.resumeanalyses.findOne()

# Find analyses by user
db.resumeanalyses.find({ user: ObjectId("USER_ID") })
```

## 7. Error Scenarios

Test these error scenarios:

### A. ML API Errors
- [ ] Empty resume text
- [ ] Very short resume (< 50 chars)
- [ ] Invalid JSON format
- [ ] Missing required fields

### B. Backend Errors
- [ ] Invalid credentials
- [ ] Duplicate email on signup
- [ ] Missing authentication token
- [ ] Invalid token
- [ ] File too large (> 5MB)
- [ ] Wrong file type
- [ ] MongoDB connection error

### C. Frontend Errors
- [ ] Network error (stop backend)
- [ ] Invalid form inputs
- [ ] Session expired (delete token)
- [ ] File upload without selection

## 8. Security Testing

### Authentication Security
- [ ] Passwords are hashed (check MongoDB)
- [ ] JWT tokens expire (wait 30 days or change JWT_EXPIRE)
- [ ] Protected routes reject invalid tokens
- [ ] CORS is configured correctly

### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] File upload restrictions enforced
- [ ] Email validation works

## Test Checklist

### ML API
- [ ] Health check returns 200
- [ ] Analysis endpoint accepts valid input
- [ ] Analysis returns proper JSON structure
- [ ] Error handling works for invalid input
- [ ] API documentation is accessible

### Backend
- [ ] Signup creates user and returns token
- [ ] Login authenticates and returns token
- [ ] Protected routes require authentication
- [ ] File upload accepts PDF/DOCX
- [ ] Text extraction works correctly
- [ ] ML API integration works
- [ ] Data is saved to MongoDB
- [ ] History retrieval works
- [ ] Delete operation works

### Frontend
- [ ] Signup form works
- [ ] Login form works
- [ ] Protected routes redirect to login
- [ ] File upload component works
- [ ] Drag and drop works
- [ ] File type validation works
- [ ] Analysis displays correctly
- [ ] Dashboard shows history
- [ ] Responsive design works
- [ ] Logout clears session

### Integration
- [ ] Complete user flow works
- [ ] Data persists across sessions
- [ ] All three services communicate properly
- [ ] Error messages are user-friendly

## Sample Test Data

### Good Resume Example
```
John Smith
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using modern technologies.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-Present
• Developed microservices using Node.js and Express
• Built responsive UIs with React and Redux
• Implemented CI/CD pipelines using Jenkins and Docker
• Managed MongoDB and PostgreSQL databases

Software Developer | StartupXYZ | 2018-2020
• Created RESTful APIs using Python and Flask
• Developed data processing pipelines
• Worked with AWS services (EC2, S3, Lambda)

SKILLS
Languages: JavaScript, Python, TypeScript, SQL
Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, Django, Flask
Databases: MongoDB, PostgreSQL, Redis
Tools: Git, Docker, Kubernetes, Jenkins, AWS

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2018
```

### Job Description Example
```
Full Stack Developer Position

We are seeking a talented Full Stack Developer to join our team.

Requirements:
- 3+ years of experience in web development
- Strong proficiency in React and Node.js
- Experience with MongoDB or other NoSQL databases
- Knowledge of RESTful API design
- Familiarity with Git and version control
- Understanding of Docker and containerization
- Experience with cloud platforms (AWS preferred)

Nice to have:
- TypeScript experience
- CI/CD pipeline experience
- Agile/Scrum methodology
```

## Troubleshooting Tests

If tests fail:

1. **Check logs**
   ```bash
   tail -f logs/ml-api.log
   tail -f logs/server.log
   tail -f logs/client.log
   ```

2. **Verify services are running**
   ```bash
   curl http://localhost:8000/health
   curl http://localhost:5000/health
   curl http://localhost:3000
   ```

3. **Check MongoDB**
   ```bash
   mongosh
   show dbs
   ```

4. **Clear data and retry**
   ```bash
   # Clear MongoDB
   mongosh
   use resume-analyzer
   db.dropDatabase()
   
   # Clear browser data
   # Open DevTools > Application > Clear storage
   ```

## Automated Testing (Future Enhancement)

Consider adding:
- **ML API**: pytest for Python
- **Backend**: Jest + Supertest for Node.js
- **Frontend**: Jest + React Testing Library

---

## Success Criteria

All tests pass when:
- ✅ All API endpoints return expected responses
- ✅ Authentication flow works completely
- ✅ Resume upload and analysis succeeds
- ✅ Results are accurate and well-formatted
- ✅ Data persists correctly in MongoDB
- ✅ UI is responsive and user-friendly
- ✅ No console errors in browser
- ✅ All error cases are handled gracefully

Happy Testing! 🧪
