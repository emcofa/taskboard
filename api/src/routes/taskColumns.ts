import express from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { toCamelCase } from '../utils/toCamelCase';

const router = express.Router();

// GET all task columns
router.get('/', async (req: any, res: any) => {
  try {
    const [columns] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column ORDER BY position ASC');
    const tasks = toCamelCase(columns);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET task column by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const [columns] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column WHERE id = ?', [req.params.id]);
    if (columns.length === 0) {
      return res.status(404).json({ error: 'Task column not found' });
    }
    const column = toCamelCase(columns[0]);
    res.json(column);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new task column
router.post('/', async (req: any, res: any) => {
  try {
    const { name, description, position } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // If position is not provided, get the next position
    let columnPosition = position;
    if (!columnPosition) {
      const [maxPosition] = await db.promise().query<RowDataPacket[]>('SELECT MAX(position) as max_pos FROM task_column');
      columnPosition = (maxPosition[0]?.max_pos || 0) + 1;
    }

    const [result] = await db.promise().query<ResultSetHeader>(
      'INSERT INTO task_column (name, description, position) VALUES (?, ?, ?)',
      [name, description || null, columnPosition]
    );

    const [newColumn] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column WHERE id = ?', [result.insertId]);
    const column = toCamelCase(newColumn[0]);
    res.status(201).json(column);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update task column
router.put('/:id', async (req: any, res: any) => {
  try {
    const { name, description, position } = req.body;
    
    const [existingColumn] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column WHERE id = ?', [req.params.id]);
    if (existingColumn.length === 0) {
      return res.status(404).json({ error: 'Task column not found' });
    }

    await db.promise().query(
      'UPDATE task_column SET name = ?, description = ?, position = ? WHERE id = ?',
      [
        name || existingColumn[0]?.name,
        description !== undefined ? description : existingColumn[0]?.description,
        position !== undefined ? position : existingColumn[0]?.position,
        req.params.id
      ]
    );

    const [updatedColumn] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column WHERE id = ?', [req.params.id]);
    const column = toCamelCase(updatedColumn[0]);
    res.json(column);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET tasks with column information
router.get('/tasks', async (req: any, res: any) => {
  try {
    const [tasks] = await db.promise().query<RowDataPacket[]>(`
      SELECT t.id, t.title, t.description, t.column_id, t.task_position, t.due_date, t.created,
             c.name as column_name, c.description as column_description
      FROM task t
      JOIN task_column c ON t.column_id = c.id
      ORDER BY c.position ASC, t.task_position ASC, t.created DESC
    `);
    const camelCaseTasks = toCamelCase(tasks);
    res.json(camelCaseTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE task column
router.delete('/:id', async (req: any, res: any) => {
  try {
    const [existingColumn] = await db.promise().query<RowDataPacket[]>('SELECT * FROM task_column WHERE id = ?', [req.params.id]);
    if (existingColumn.length === 0) {
      return res.status(404).json({ error: 'Task column not found' });
    }

    // Check if there are tasks in this column
    const [tasksInColumn] = await db.promise().query<RowDataPacket[]>('SELECT COUNT(*) as count FROM task WHERE column_id = ?', [req.params.id]);
    if (tasksInColumn[0]?.count > 0) {
      return res.status(400).json({ error: 'Cannot delete column with existing tasks' });
    }

    await db.promise().query('DELETE FROM task_column WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task column deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET tasks by column ID
router.get('/:id/tasks', async (req: any, res: any) => {
  try {
    const [tasks] = await db.promise().query<RowDataPacket[]>(`
      SELECT t.*, c.name as column_name, c.description as column_description
      FROM task t
      JOIN task_column c ON t.column_id = c.id
      WHERE t.column_id = ?
      ORDER BY t.task_position ASC, t.created DESC
    `, [req.params.id]);
    const camelCaseTasks = toCamelCase(tasks);
    res.json(camelCaseTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
