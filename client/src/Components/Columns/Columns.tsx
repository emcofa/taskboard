import React from 'react'
import './columns.scss'
import Cards from '../Cards/Cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Remove this when backend is implemented task_columns
const taskColumns = [
  { id: 1, name: 'Backlog', position: 1, description: 'Tasks not started yet' },
  { id: 2, name: 'To Do', position: 2, description: 'Tasks ready to start' },
  { id: 3, name: 'In Progress', position: 3, description: 'Tasks being worked on' },
  { id: 4, name: 'Done', position: 4, description: 'Completed tasks' },
];

// Remove this when backend is implemented tasks
export const tasks = [
  {
    id: 1,
    title: 'Design wireframes',
    description: 'Skapa grundläggande skisser för appens användargränssnitt.',
    columnId: 1,
    created: '2025-08-01T10:00:00Z',
    dueDate: '2025-08-10T17:00:00Z',
  },
  {
    id: 2,
    title: 'Research user needs',
    description: 'Genomför intervjuer och samla in feedback från användare.',
    columnId: 1,
    created: '2025-08-02T11:00:00Z',
    dueDate: '2025-08-12T16:00:00Z',
  },
  {
    id: 3,
    title: 'Setup project repository',
    description: 'Initiera Git-repo och konfigurera grundläggande struktur.',
    columnId: 2,
    created: '2025-08-03T09:30:00Z',
    dueDate: '2025-08-08T18:00:00Z',
  },
  {
    id: 4,
    title: 'Implement login flow',
    description: 'Bygg frontend och backend för användarinloggning.',
    columnId: 3,
    created: '2025-08-04T14:45:00Z',
    dueDate: '2025-08-15T12:00:00Z',
  },
  {
    id: 5,
    title: 'Write unit tests',
    description: 'Skriv tester för att säkerställa kodens kvalitet och funktionalitet.',
    columnId: 4,
    created: '2025-08-05T08:20:00Z',
    dueDate: '2025-08-18T10:00:00Z',
  },
  {
    id: 6,
    title: 'Deploy to staging',
    description: 'Sätt upp staging-miljö för testning av nya funktioner.',
    columnId: 4,
    created: '2025-08-06T13:15:00Z',
    dueDate: '2025-08-20T15:00:00Z',
  },
];


const headerColors = ['#F3C5C5', '#FADFC1', '#D5D2FD', '#BFF0DB', '#B1CBE8', '#F2F2D0'];

const Columns = () => {
  return (
    <div className='Columns'>
      {taskColumns.map((column) => (
        <div key={column.id} className='Column'>
          <div className='Column-header' style={{ backgroundColor: headerColors[column.id - 1] }}>
            <div className='Title-count'>
              <h3>{column.name}</h3>
              <h3 className='Column-header-count'>{tasks.filter((task) => task.columnId === column.id).length}</h3>
            </div>
            <h3 className='Column-header-button'><FontAwesomeIcon icon={faPlus} /></h3>
          </div>
          <Cards columnId={column.id} tasks={tasks} />

        </div>
      ))}
    </div>
  )
}

export default Columns