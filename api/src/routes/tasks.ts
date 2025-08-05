import express from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { toCamelCase } from '../utils/toCamelCase';

const router = express.Router();

// Helper function to convert Date objects to ISO strings in task objects
const convertTaskDates = (task: any) => {
  if (task.dueDate instanceof Date) {
    task.dueDate = task.dueDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  }
  return task;
};

// GET all tasks
router.get('/', async (req: any, res: any) => {
  try {
    const [tasks] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task ORDER BY created DESC');
    const camelCaseTasks = toCamelCase(tasks);
    const tasksWithConvertedDates = camelCaseTasks.map(convertTaskDates);
    res.json(tasksWithConvertedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET tasks by column
router.get('/column/:columnId', async (req: any, res: any) => {
  try {
    const [tasks] = await db.promise().query<RowDataPacket[]>(
      'SELECT * FROM task WHERE column_id = ? ORDER BY task_position ASC, created DESC',
      [req.params.columnId]
    );
    const camelCaseTasks = toCamelCase(tasks);
    const tasksWithConvertedDates = camelCaseTasks.map(convertTaskDates);
    res.json(tasksWithConvertedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET task by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const [tasks] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task WHERE id = ?', [req.params.id]);
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = toCamelCase(tasks[0]);
    const taskWithConvertedDates = convertTaskDates(task);
    res.json(taskWithConvertedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new task
router.post('/', async (req: any, res: any) => {
  try {
    const { title, description, column_id, task_position, due_date } = req.body;
    
    if (!title || !column_id) {
      return res.status(400).json({ error: 'Title and column_id are required' });
    }

    const [result] = await db.promise().query<ResultSetHeader>(
      'INSERT INTO task (title, description, column_id, task_position, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, column_id, task_position || 1, due_date || null]
    );

    const [newTask] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task WHERE id = ?', [result.insertId]);
    const task = toCamelCase(newTask[0]);
    const taskWithConvertedDates = convertTaskDates(task);
    res.status(201).json(taskWithConvertedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update task
router.put('/:id', async (req: any, res: any) => {
  try {
    const { title, description, column_id, task_position, due_date } = req.body;
    
    const [existingTask] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task WHERE id = ?', [req.params.id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.promise().query(
      'UPDATE task SET title = ?, description = ?, column_id = ?, task_position = ?, due_date = ? WHERE id = ?',
      [
        title || existingTask[0]?.title,
        description !== undefined ? description : existingTask[0]?.description,
        column_id || existingTask[0]?.column_id,
        task_position !== undefined ? task_position : existingTask[0]?.task_position,
        due_date !== undefined ? due_date : existingTask[0]?.due_date,
        req.params.id
      ]
    );

    const [updatedTask] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task WHERE id = ?', [req.params.id]);
    const task = toCamelCase(updatedTask[0]);
    const taskWithConvertedDates = convertTaskDates(task);
    res.json(taskWithConvertedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE task
router.delete('/:id', async (req: any, res: any) => {
  try {
    const [existingTask] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task WHERE id = ?', [req.params.id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.promise().query('DELETE FROM task WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;