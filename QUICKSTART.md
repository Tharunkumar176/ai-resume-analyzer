# Quick Start Guide - AI Resume Analyzer

## Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** (check: `python3 --version`)
- **Node.js 16+** (check: `node --version`)
- **MongoDB** (local or MongoDB Atlas)
- **npm** (comes with Node.js)

## Installation

### Option 1: Automated Setup (Recommended)

Run the setup script to install all dependencies:

```bash
./setup.sh
```

This will:
- Create Python virtual environment
- Install all Python dependencies
- Install Node.js dependencies for both server and client
- Create .env files from examples

### Option 2: Manual Setup

#### 1. ML API Setup

```bash
cd ml-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 2. Server Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env and update MongoDB URI and JWT secret
cd ..
```

#### 3. Client Setup

```bash
cd client
npm install
cp .env.example .env
cd ..
```

## Configuration

### MongoDB

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `server/.env` with your MongoDB Atlas URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer
   ```

### Environment Variables

**server/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRE=30d
ML_API_URL=http://localhost:8000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Start All Services Together (Recommended)

```bash
./start.sh
```

This starts:
- ML API on http://localhost:8000
- Backend Server on http://localhost:5000
- Frontend Client on http://localhost:3000

Access the app at: **http://localhost:3000**

Press `Ctrl+C` to stop all services.

### Option 2: Start Services Individually

**Terminal 1 - ML API:**
```bash
cd ml-api
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 3 - Frontend Client:**
```bash
cd client
npm run dev
```

## Using the Application

### 1. Sign Up

- Navigate to http://localhost:3000
- Click "Sign Up"
- Enter your name, email, and password
- Click "Create Account"

### 2. Upload Resume

- After login, click "Upload Resume"
- Select a PDF or DOCX file (max 5MB)
- Optionally, paste a job description for targeted analysis
- Click "Analyze Resume"

### 3. View Results

The analysis will show:
- **Overall Score**: Comprehensive resume rating
- **ATS Score**: Applicant Tracking System compatibility
- **Keyword Score**: Match with job description
- **Skills Analysis**: Matched and missing skills
- **Experience Score**: Work experience evaluation
- **Suggestions**: Personalized improvement tips

### 4. View History

- Click "Dashboard" to see all your past analyses
- View detailed results for any previous analysis
- Delete old analyses

## API Documentation

### ML API (FastAPI)

Interactive documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Backend API (Express)

**Authentication:**
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Troubleshooting

### Issue: MongoDB Connection Error

**Solution:**
- Ensure MongoDB is running: `brew services list` (macOS)
- Check MongoDB URI in `server/.env`
- For Atlas, check your connection string and IP whitelist

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port (e.g., 8000)
lsof -i :8000
# Kill the process
kill -9 <PID>
```

### Issue: ML API Not Responding

**Solution:**
- Ensure virtual environment is activated
- Check if all Python dependencies are installed
- Verify ML API is running on port 8000

### Issue: Frontend Build Errors

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Import Errors in Python

**Solution:**
```bash
cd ml-api
source venv/bin/activate
pip install -r requirements.txt
```

## Development Tips

### Hot Reload

All services support hot reload:
- **ML API**: Uses `--reload` flag (changes to Python files auto-reload)
- **Server**: Uses `nodemon` (changes to JS files auto-reload)
- **Client**: Vite HMR (instant updates in browser)

### Viewing Logs

When using `./start.sh`, logs are saved to:
- `logs/ml-api.log`
- `logs/server.log`
- `logs/client.log`

View in real-time:
```bash
tail -f logs/ml-api.log
tail -f logs/server.log
tail -f logs/client.log
```

### Database Management

View MongoDB data:
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use resume-analyzer

# View collections
show collections

# View users
db.users.find()

# View analyses
db.resumeanalyses.find()
```

## Testing

### Test ML API

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Experienced Software Engineer with 5 years in Python, JavaScript, React, Node.js...",
    "job_description": "Looking for a Full Stack Developer..."
  }'
```

### Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# After login, test with token
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Deployment

### Build for Production

**Frontend:**
```bash
cd client
npm run build
# Output in client/dist
```

**Backend:**
- Set `NODE_ENV=production` in `.env`
- Use PM2 or similar for process management

**ML API:**
- Use Gunicorn instead of uvicorn for production
- Deploy to cloud services (AWS, Google Cloud, etc.)

### Environment Variables for Production

Update all `.env` files with production values:
- Use secure JWT secrets
- Use production MongoDB URI (MongoDB Atlas recommended)
- Update API URLs to production domains
- Enable HTTPS

## Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Express.js Documentation**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

## Support

For issues or questions:
1. Check this guide first
2. Review the main README.md
3. Check logs for error messages
4. Open an issue in the repository

---

Happy Analyzing! 🚀
