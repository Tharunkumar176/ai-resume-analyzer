#!/bin/bash

# AI Resume Analyzer - Start Script

echo "🚀 Starting AI Resume Analyzer..."
echo ""
echo "This will start all three services:"
echo "  - ML API (Python FastAPI) on port 8000"
echo "  - Server (Node.js Express) on port 5000"
echo "  - Client (React + Vite) on port 3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $ML_PID $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start ML API
echo "🐍 Starting ML API..."
cd ml-api
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../logs/ml-api.log 2>&1 &
ML_PID=$!
echo "✅ ML API started (PID: $ML_PID)"
cd ..

# Wait a moment for ML API to start
sleep 2

# Start Server
echo "📦 Starting Server..."
cd server
npm run dev > ../logs/server.log 2>&1 &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"
cd ..

# Wait a moment for Server to start
sleep 2

# Start Client
echo "⚛️  Starting Client..."
cd client
npm run dev > ../logs/client.log 2>&1 &
CLIENT_PID=$!
echo "✅ Client started (PID: $CLIENT_PID)"
cd ..

echo ""
echo "✨ All services are running!"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo "📡 ML API documentation: http://localhost:8000/docs"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "📋 Logs are being written to the logs/ directory"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop the services
wait
