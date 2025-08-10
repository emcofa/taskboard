import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRouter from './routes/tasks';
import taskColumnRouter from './routes/taskColumns';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


// API routes
app.use('/api/task', taskRouter);
app.use('/api/task-column', taskColumnRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
}); 

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
