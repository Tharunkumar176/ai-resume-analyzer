#!/bin/bash

# AI Resume Analyzer - All-in-One Setup and Run Script
# This script will install dependencies and start all services

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════════"
echo "    🚀 AI Resume Analyzer - All-in-One Setup & Launch 🚀"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    print_warning "Stopping all services..."
    kill $ML_PID $SERVER_PID $CLIENT_PID 2>/dev/null
    print_success "All services stopped"
    exit
}

trap cleanup EXIT INT TERM

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "══════════════════════════════════════════════════════════════"
echo "📋 STEP 1: Checking Prerequisites"
echo "══════════════════════════════════════════════════════════════"
echo ""

# Check Python
print_status "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_error "Python 3 is not installed!"
    echo "Please install Python 3.8 or higher from https://www.python.org/"
    exit 1
fi

# Check Node.js
print_status "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed!"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check npm
print_status "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "🔧 STEP 2: Setting Up ML API (Python FastAPI)"
echo "══════════════════════════════════════════════════════════════"
echo ""

cd ml-api

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
print_status "Installing Python dependencies (this may take a few minutes)..."
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
print_success "Python dependencies installed"

cd ..

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "🔧 STEP 3: Setting Up Server (Node.js Express)"
echo "══════════════════════════════════════════════════════════════"
echo ""

cd server

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js server dependencies..."
    npm install --silent
    print_success "Server dependencies installed"
else
    print_success "Server dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from example..."
    cp .env.example .env
    print_success ".env file created"
fi

cd ..

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "🔧 STEP 4: Setting Up Client (React + Vite)"
echo "══════════════════════════════════════════════════════════════"
echo ""

cd client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing React client dependencies..."
    npm install --silent
    print_success "Client dependencies installed"
else
    print_success "Client dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from example..."
    cp .env.example .env
    print_success ".env file created"
fi

cd ..

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "✨ STEP 5: Configuration Check"
echo "══════════════════════════════════════════════════════════════"
echo ""

# Check MongoDB configuration
if grep -q "mongodb://localhost" server/.env; then
    print_warning "Using local MongoDB - Make sure MongoDB is running!"
    print_warning "Or update server/.env with MongoDB Atlas connection string"
else
    print_success "MongoDB Atlas configuration detected"
fi

echo ""
print_success "All setup completed successfully!"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

echo "══════════════════════════════════════════════════════════════"
echo "🚀 STEP 6: Starting All Services"
echo "══════════════════════════════════════════════════════════════"
echo ""

print_status "Starting services in background..."
echo ""

# Start ML API
print_status "Starting ML API on port 8000..."
cd ml-api
source venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../logs/ml-api.log 2>&1 &
ML_PID=$!
print_success "ML API started (PID: $ML_PID)"
cd ..

# Wait for ML API to start
sleep 3

# Start Server
print_status "Starting Express Server on port 5000..."
cd server
nohup npm run dev > ../logs/server.log 2>&1 &
SERVER_PID=$!
print_success "Server started (PID: $SERVER_PID)"
cd ..

# Wait for Server to start
sleep 3

# Start Client
print_status "Starting React Client on port 3000..."
cd client
nohup npm run dev > ../logs/client.log 2>&1 &
CLIENT_PID=$!
print_success "Client started (PID: $CLIENT_PID)"
cd ..

# Wait for services to fully start
print_status "Waiting for services to initialize..."
sleep 5

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "✅ All Services Running Successfully!"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Access Points:"
echo "   • Frontend:        http://localhost:3000"
echo "   • Backend API:     http://localhost:5000"
echo "   • ML API:          http://localhost:8000"
echo "   • API Docs:        http://localhost:8000/docs"
echo ""
echo "📊 Service Status:"
echo "   • ML API (FastAPI):  PID $ML_PID"
echo "   • Server (Express):  PID $SERVER_PID"
echo "   • Client (React):    PID $CLIENT_PID"
echo ""
echo "📋 Log Files:"
echo "   • ML API:   logs/ml-api.log"
echo "   • Server:   logs/server.log"
echo "   • Client:   logs/client.log"
echo ""
echo "💡 Quick Start:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Sign up for a new account"
echo "   3. Upload your resume (PDF or DOCX)"
echo "   4. Get instant AI-powered analysis!"
echo ""
echo "🛑 To Stop:"
echo "   Press Ctrl+C in this terminal"
echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

# Check if services are responding
print_status "Verifying services..."
sleep 2

# Check ML API
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    print_success "ML API is responding ✓"
else
    print_warning "ML API may still be starting..."
fi

# Check Server
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Server is responding ✓"
else
    print_warning "Server may still be starting..."
fi

# Check Client
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Client is responding ✓"
else
    print_warning "Client may still be starting..."
fi

echo ""
print_success "🎉 AI Resume Analyzer is ready to use!"
echo ""
echo "Opening application in your default browser..."

# Try to open browser (works on macOS, Linux, and Windows WSL)
if command -v open &> /dev/null; then
    sleep 2
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open http://localhost:3000
elif command -v start &> /dev/null; then
    sleep 2
    start http://localhost:3000
fi

echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Keep script running and wait for user to stop
wait
