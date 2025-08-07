-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS taskboard;
USE taskboard;

-- Create task_column table
CREATE TABLE IF NOT EXISTS task_column (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    position INT NOT NULL UNIQUE,
    description TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create task table
CREATE TABLE IF NOT EXISTS task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    column_position INT NOT NULL,
    task_position INT NOT NULL DEFAULT 1,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    description TEXT,
    FOREIGN KEY (column_position) REFERENCES task_column(position)
);

-- Insert default columns
INSERT IGNORE INTO task_column (name, description, position) VALUES
('Backlog', 'Tasks in the backlog', 1),
('To Do', 'Tasks that need to be done', 2),
('In Progress', 'Tasks currently being worked on', 3),
('Done', 'Completed tasks', 4),
('Archive', 'Archived tasks', 5);

-- Insert sample task
INSERT IGNORE INTO task (title, description, column_position, task_position, due_date) VALUES
('Set up project', 'Initialize the taskboard project with React and Node.js', 2, 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Design database schema', 'Create the database structure for task and columns', 3, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Create API endpoints', 'Implement RESTful API for task management', 3, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Build frontend components', 'Create React components for the taskboard', 2, 2, DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
('Test the application', 'Write tests and perform manual testing', 4, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY)); 