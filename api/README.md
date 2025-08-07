# Taskboard API

A RESTful API for managing tasks and task columns in a Kanban-style taskboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taskboard
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if the API is running

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
- `column_id` (INT, NOT NULL, FOREIGN KEY)
- `task_position` (INT, NOT NULL, DEFAULT 1)
- `created` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `due_date` (DATETIME, NULL)
- `description` (TEXT, NULL)

### Task Column Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(50), NOT NULL)
- `position` (INT, NOT NULL)
- `description` (TEXT, NULL)
- `created` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Error Responses

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