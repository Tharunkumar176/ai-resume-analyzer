# Server Backend - Resume Analyzer

Express.js backend for the Resume Analyzer application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Ensure MongoDB is running locally or update `MONGODB_URI` with your MongoDB connection string

5. Ensure ML API is running on port 8000

6. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Resume Analysis
- `POST /api/resume/analyze` - Upload and analyze resume (Protected)
- `GET /api/resume/history` - Get analysis history (Protected)
- `GET /api/resume/analysis/:id` - Get specific analysis (Protected)
- `DELETE /api/resume/analysis/:id` - Delete analysis (Protected)

## Project Structure

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── resumeController.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── User.js
│   └── ResumeAnalysis.js
├── routes/
│   ├── authRoutes.js
│   └── resumeRoutes.js
├── service/
│   ├── pdfParser.js
│   ├── docxParser.js
│   └── mlService.js
├── server.js
└── package.json
```
