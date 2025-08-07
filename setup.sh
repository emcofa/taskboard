#!/bin/bash

# Taskboard Full Stack Setup Script
echo "🚀 Setting up Taskboard Full Stack Application..."

# Colors for output
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
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v16 or higher."
    print_status "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed. Please install MySQL v8.0 or higher."
    print_status "Download from: https://dev.mysql.com/downloads/"
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_warning "Git is not installed. This is optional but recommended."
fi

print_success "Prerequisites check passed"

# Database Setup
print_status "Setting up database..."
echo "Please enter your MySQL root password:"
if mysql -u root -p < api/database.sql; then
    print_success "Database setup completed"
else
    print_error "Database setup failed. Please check your MySQL credentials and try again."
    exit 1
fi

# Backend Setup
print_status "Setting up backend..."
cd api

# Install dependencies
print_status "Installing backend dependencies..."
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskboard

# Server Configuration
PORT=5000

# Optional: Set to 'development' for more verbose logging
NODE_ENV=development
EOF
    print_success "Created .env file"
    print_warning "Please edit api/.env file with your MySQL password"
else
    print_success ".env file already exists"
fi

cd ..

# Frontend Setup
print_status "Setting up frontend..."
cd client

# Install dependencies
print_status "Installing frontend dependencies..."
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Final instructions
echo ""
echo -e "${GREEN} Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit ${YELLOW}api/.env${NC} file with your MySQL password"
echo "2. Start the backend: ${YELLOW}cd api && npm run dev${NC}"
echo "3. Start the frontend: ${YELLOW}cd client && npm start${NC}"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo "• Frontend: ${GREEN}http://localhost:3000${NC}"
echo "• Backend API: ${GREEN}http://localhost:5000${NC}"
echo "• API Health Check: ${GREEN}http://localhost:5000/health${NC}"
echo ""
echo -e "${BLUE}Quick start commands:${NC}"
echo "• Backend: ${YELLOW}cd api && npm run dev${NC}"
echo "• Frontend: ${YELLOW}cd client && npm start${NC}"
echo ""
echo -e "${GREEN}Happy coding! ${NC}" 