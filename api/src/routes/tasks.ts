import express from 'express';
import { db } from '../db';

const router = express.Router();

router.get('/', (req: any, res: any) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

export default router;