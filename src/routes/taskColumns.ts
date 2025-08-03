const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/tasks', async (req, res) => {
    try {
      const [tasks] = await db.query(`
        SELECT t.id, t.title, t.column_id, c.name as column_name
        FROM tasks t
        JOIN task_columns c ON t.column_id = c.id
        ORDER BY t.created_at DESC
      `);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
  });

module.exports = router;
