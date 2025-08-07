# Taskboard API

A RESTful API for managing tasks and task columns in a Kanban-style taskboard. Built with Node.js, Express, TypeScript, and MySQL.

## Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up the database:**
```bash
# Start MySQL and create the database
mysql -u root -p < database.sql
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taskboard
PORT=5000
```

5. **Start the development server:**
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Project Structure
```
api/
├── src/
│   ├── routes/
│   │   ├── tasks.ts          # Task-related endpoints
│   │   └── taskColumns.ts    # Column-related endpoints
│   ├── utils/
│   │   └── toCamelCase.ts    # Utility functions
│   ├── db.ts                 # Database connection
│   └── server.ts             # Express server setup
├── database.sql              # Database schema and sample data
├── package.json
└── tsconfig.json
```

## API Endpoints

### Tasks

#### Get all tasks
- **GET** `/api/tasks`
- Returns all tasks ordered by creation date

#### Get task by ID
- **GET** `/api/tasks/:id`
- Returns a specific task by ID

#### Create new task
- **POST** `/api/tasks`
- Body:
```json
{
  "title": "Task title",
  "description": "Task description",
  "column_id": 1,
  "task_position": 1,
  "due_date": "2024-01-15"
}
```

#### Update task
- **PUT** `/api/tasks/:id`
- Body: (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "column_id": 2,
  "task_position": 2,
  "due_date": "2024-01-20"
}
```

#### Delete task
- **DELETE** `/api/tasks/:id`
- Deletes a task by ID

#### Get tasks by column
- **GET** `/api/tasks/column/:columnId`
- Returns all tasks in a specific column

### Task Columns

#### Get all columns
- **GET** `/api/task-columns`
- Returns all task columns ordered by position

#### Get column by ID
- **GET** `/api/task-columns/:id`
- Returns a specific column by ID

#### Create new column
- **POST** `/api/task-columns`
- Body:
```json
{
  "name": "Column name",
  "description": "Column description",
  "position": 1
}
```

#### Update column
- **PUT** `/api/task-columns/:id`
- Body: (all fields optional)
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "position": 2
}
```

#### Delete column
- **DELETE** `/api/task-columns/:id`
- Deletes a column (only if no tasks are in it)

#### Get tasks with column info
- **GET** `/api/task-columns/tasks`
- Returns all tasks with their column information

#### Get tasks by column ID
- **GET** `/api/task-columns/:id/tasks`
- Returns all tasks in a specific column with column details

## Database Schema

### Task Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `title` (VARCHAR(255), NOT NULL)
- `column_position` (INT, NOT NULL, FOREIGN KEY)
- `task_position` (INT, NOT NULL, DEFAULT 1)
- `created` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `due_date` (DATETIME, NULL)
- `description` (TEXT, NULL)

### Task Column Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(50), NOT NULL)
- `position` (INT, NOT NULL, UNIQUE)
- `description` (TEXT, NULL)
- `created` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Sample Data

The `database.sql` file includes:
- Default columns: Backlog, To Do, In Progress, Done, Archive
- Sample tasks to get you started

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

