import { Task, TaskColumn } from './types';

const API_BASE_URL = 'http://localhost:3301/api';

export const fetchColumns = async (): Promise<TaskColumn[]> => {
  const response = await fetch(`${API_BASE_URL}/task-column`);
  if (!response.ok) {
    throw new Error(`Failed to fetch columns: ${response.statusText}`);
  }
  return response.json();
};

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/task`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  const tasksData = await response.json();
  
  return tasksData.map((task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    columnPosition: task.columnPosition,
    created: task.created,
    dueDate: task.dueDate
  }));
};

export const fetchColumnsAndTasks = async (): Promise<{ columns: TaskColumn[], tasks: Task[] }> => {
  try {
    const [columns, tasks] = await Promise.all([
      fetchColumns(),
      fetchTasks()
    ]);
    
    return { columns, tasks };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}; 

export const fetchTask = async (taskId: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  return response.json();
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
};

export const updateTask = async (taskId: number, updates: Partial<Task>): Promise<Task> => {
  // Convert camelCase to snake_case for backend compatibility
  const backendUpdates: {
    title?: string;
    description?: string;
    column_position?: number;
    due_date?: string | null;
  } = {};
  if (updates.title !== undefined) backendUpdates.title = updates.title;
  if (updates.description !== undefined) backendUpdates.description = updates.description;
  if (updates.columnPosition !== undefined) backendUpdates.column_position = updates.columnPosition;
  if (updates.dueDate !== undefined) backendUpdates.due_date = updates.dueDate;

  const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendUpdates),
  });
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
  return response.json();
};

export const createTask = async (taskData: { title: string; description?: string; columnPosition: number; dueDate?: string }): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description || null,
      column_position: taskData.columnPosition,
      due_date: taskData.dueDate || null
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  return response.json();
};

export const moveTask = async (taskId: number, newColumnPosition: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      column_position: newColumnPosition
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to move task: ${response.statusText}`);
  }
  return response.json();
};