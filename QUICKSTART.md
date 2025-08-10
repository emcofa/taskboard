# Quick Start Guide

Get your Taskboard application running in minutes!

## Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)

## One-Command Setup

```bash
# Clone and setup everything automatically
git clone https://github.com/yourusername/taskboard.git
cd taskboard
./setup.sh
```

## Manual Setup (if automated setup fails)

### 1. Database
```bash
# Start MySQL and create database
mysql -u root -p < api/database.sql
```

### 2. Backend
```bash
cd api
npm install
# Edit .env file with your MySQL password
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm start
```

## Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## Common Issues

### Database Connection Error
- Ensure MySQL is running
- Check your password in `api/.env`

### Port Already in Use
- Kill processes: `lsof -ti:3000 | xargs kill -9` (frontend)
- Kill processes: `lsof -ti:5001 | xargs kill -9` (backend)

### CORS Errors
- Ensure backend is running on port 5001
- Check that frontend is making requests to the right URL

## Next Steps

1. Create your first task
2. Drag and drop tasks between columns
3. Customize your workflow