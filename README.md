# Taskboard

A modern Kanban-style task management tool built with React, TypeScript, Node.js, Express, and MySQL. Features drag-and-drop functionality, real-time updates, and a clean, intuitive interface.


## Features

- **Drag & Drop Interface**: Intuitive task management with smooth drag-and-drop functionality
- **Real-time Updates**: Instant updates across all connected clients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Task Management**: Create, edit, delete, and move tasks between columns
- **Column Management**: Customize your workflow with flexible column setup
- **Due Date Tracking**: Set and track task deadlines
- **Modern UI**: Clean, modern interface built with SCSS

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Create React App** for development setup
- **SCSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **FontAwesome** for icons
- **React Tooltip** for enhanced UX

### Backend
- **Node.js** with TypeScript
- **Express.js** for RESTful API
- **MySQL** database
- **CORS** enabled for cross-origin requests
- **dotenv** for environment configuration

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

> **For the fastest setup, see [QUICKSTART.md](QUICKSTART.md)**

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/taskboard.git
cd taskboard

# Run the automated setup script
./setup.sh
```

The setup script will:
- Check prerequisites (Node.js, MySQL)
- Set up the database
- Install dependencies for both frontend and backend
- Create environment files
- Provide next steps

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskboard.git
cd taskboard
```

#### 2. Database Setup

#### Start MySQL Service
```bash
# On macOS (if installed via Homebrew)
brew services start mysql

# On Windows
net start mysql

# On Linux
sudo systemctl start mysql
```

#### Create Database and Tables
```bash
# Connect to MySQL as root
mysql -u root -p

# Run the database setup script
source api/database.sql
```

Alternatively, you can run the SQL commands directly:
```sql
CREATE DATABASE IF NOT EXISTS taskboard;
USE taskboard;
-- The rest of the schema is in api/database.sql
```

#### 3. Backend Setup

```bash
# Navigate to the API directory
cd api

# Install dependencies
npm install

# Create environment file (or use the setup script)
# The setup script will create this automatically
```

Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskboard
PORT=5000
```

```bash
# Start the development server
npm run dev
```

The API will be running at `http://localhost:5000`

#### 4. Frontend Setup

```bash
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be running at `http://localhost:3000`

## Project Structure

```
taskboard/
├── api/                    # Backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   ├── db.ts          # Database connection
│   │   └── server.ts      # Express server
│   ├── database.sql       # Database schema
│   ├── setup.sh           # Backend setup script
│   └── package.json
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── Components/    # React components
│   │   ├── Modals/        # Modal components
│   │   ├── resources/     # API calls and types
│   │   └── App.tsx        # Main app component
│   ├── setup.sh           # Frontend setup script
│   └── package.json
├── setup.sh               # Full stack setup script
└── README.md
```

## Available Scripts

### Setup Scripts
- `./setup.sh` - Full stack setup (database, backend, frontend)
- `./api/setup.sh` - Backend-only setup
- `./client/setup.sh` - Frontend-only setup

### Backend (api/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

The backend provides the following RESTful endpoints:

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/column/:columnId` - Get tasks by column

### Columns
- `GET /api/task-columns` - Get all columns
- `POST /api/task-columns` - Create a new column
- `PUT /api/task-columns/:id` - Update a column
- `DELETE /api/task-columns/:id` - Delete a column
