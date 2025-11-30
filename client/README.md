# Client - AI Resume Analyzer

React frontend application built with Vite and Tailwind CSS.

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

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

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
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── resumeService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Features

- User authentication (signup/login)
- Resume upload (PDF/DOCX)
- Real-time analysis with ML backend
- Detailed score breakdown
- Skills matching
- Improvement suggestions
- Analysis history
- Responsive design with Tailwind CSS
