export type Task = {
  id: number;
  title: string;
  description?: string;
  columnId: number;
  created: string;
  dueDate?: string | null;
} 