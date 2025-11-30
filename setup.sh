#!/bin/bash

# AI Resume Analyzer - Setup Script

echo "🚀 Setting up AI Resume Analyzer..."
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On macOS with Homebrew: brew services start mongodb-community"
    echo "   Or use MongoDB Atlas for cloud database"
    echo ""
else
    echo "✅ MongoDB is running"
    echo ""
fi

# Setup ML API
echo "🔧 Setting up ML API (Python FastAPI)..."
cd ml-api

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -q -r requirements.txt
echo "✅ ML API dependencies installed"
echo ""

cd ..

# Setup Server
echo "🔧 Setting up Server (Node.js Express)..."
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB URI and JWT secret"
fi

echo "✅ Server dependencies installed"
echo ""

cd ..

# Setup Client
echo "🔧 Setting up Client (React + Vite)..."
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "✅ Client dependencies installed"
echo ""

cd ..

echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Make sure MongoDB is running (locally or Atlas)"
echo "   2. Update server/.env with your MongoDB URI and JWT secret"
echo "   3. Run './start.sh' to start all services"
echo ""
