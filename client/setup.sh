#!/bin/bash

# Taskboard Frontend Setup Script
echo "Setting up Taskboard Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "Prerequisites check passed"

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully"
else
    echo "Failed to install dependencies"
    exit 1
fi

echo ""
echo "Frontend setup completed!"
echo ""
echo "Next steps:"
echo "1. Ensure the backend API is running on http://localhost:5001"
echo "2. Run 'npm start' to start the development server"
echo "3. The frontend will be available at http://localhost:3000"
echo ""
echo "Happy coding!" 