# Taskboard

A simple Kanban style task management tool built with a fullstack setup: React (with TypeScript) on the frontend and Node.js + Express + MySQL on the backend.

---

## Tech Stack

### Frontend:
- React
- TypeScript
- Create React App
- SCSS
- Fetch API

### Backend:
- Node.js
- Express
- MySQL
- dotenv

---

## Steps

### 1. Clone the repo
git clone git@github.com:yourusername/taskboard.git
cd taskboard

### 2. Setup the backend

#### a. Navigate to the API folder
cd api

#### b. Install dependencies
npm install

#### c. Create a .env file in the api/ folder
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taskboard
PORT=5000

#### d. Start MySQL and create database
CREATE DATABASE taskboard;


#### e. Run the server
npm run dev

The server will run at http://localhost:5000

### 3. Setup the frontend

### 1. Clone the repo
git clone git@github.com:yourusername/taskboard.git
cd taskboard

### 2. Setup the backend

#### a. Navigate to the client folder
cd client

#### b. Install dependencies
npm install

#### c. Run the frontend
npm start

The frontend will be running at http://localhost:3000.





