import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks';

import taskColumnsRouter from './routes/taskColumns';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/task-columns', taskColumnsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
