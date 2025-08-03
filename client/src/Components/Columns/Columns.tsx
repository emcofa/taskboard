import React from 'react'
import './columns.scss'
import Cards from '../Cards/Cards'

// Remove this when backend is implemented task_columns
const taskColumns = [
  { id: 1, name: 'Backlog', position: 1, description: 'Tasks not started yet' },
  { id: 2, name: 'To Do', position: 2, description: 'Tasks ready to start' },
  { id: 3, name: 'In Progress', position: 3, description: 'Tasks being worked on' },
  { id: 4, name: 'Done', position: 4, description: 'Completed tasks' },
];

// Remove this when backend is implemented tasks
export const tasks = [
  { id: 1, title: 'Task 1', column_id: 1, created_at: '2025-08-01T10:00:00Z' },
  { id: 2, title: 'Task 2', column_id: 1, created_at: '2025-08-02T11:00:00Z' },
  { id: 3, title: 'Task 3', column_id: 2, created_at: '2025-08-03T09:30:00Z' },
  { id: 4, title: 'Task 4', column_id: 3, created_at: '2025-08-04T14:45:00Z' },
  { id: 5, title: 'Task 5', column_id: 4, created_at: '2025-08-05T08:20:00Z' },
  { id: 6, title: 'Task 6', column_id: 4, created_at: '2025-08-06T13:15:00Z' },
];

const headerColors = ['#F3C5C5', '#FADFC1', '#D5D2FD', '#BFF0DB', '#B1CBE8', '#F2F2D0'];

const Columns = () => {
  return (
    <div className='Columns'>
      {taskColumns.map((column) => (
        <div key={column.id} className='Column'>
          <div className='Column-header' style={{ backgroundColor: headerColors[column.id - 1] }}>
            <h3>{column.name}</h3>
            <h3 className='Column-header-count'>{tasks.filter((task) => task.column_id === column.id).length}</h3>
          </div>
          <Cards columnId={column.id} tasks={tasks} />
        </div>
      ))}
    </div>
  )
}

export default Columns