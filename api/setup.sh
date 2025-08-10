#!/bin/bash

# Taskboard API Setup Script
echo "Setting up Taskboard API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL v8.0 or higher."
    exit 1
fi

echo "Prerequisites check passed"

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskboard

# Server Configuration
PORT=5001

# Optional: Set to 'development' for more verbose logging
NODE_ENV=development
EOF
    echo "Created .env file"
    echo "Please edit .env file with your MySQL password"
else
    echo ".env file already exists"
fi

# Setup database
echo "Setting up database..."
echo "Please enter your MySQL root password:"
mysql -u root -p < database.sql

if [ $? -eq 0 ]; then
    echo "Database setup completed"
else
    echo "Database setup failed. Please check your MySQL credentials and try again."
    exit 1
fi

echo ""
echo "Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your MySQL password"
echo "2. Run 'npm run dev' to start the development server"
echo "3. The API will be available at http://localhost:5001"
echo ""
echo "Happy coding!" 