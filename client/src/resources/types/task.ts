export type Task = {
  id: number;
  title: string;
  description?: string;
  columnPosition: number;
  created: string;
  dueDate?: string | null;
} 