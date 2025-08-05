import React, { useState, useEffect } from 'react'
import './columns.scss'
import Cards from '../Cards/Cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task, TaskColumn } from '../../resources/types';
import { fetchColumnsAndTasks } from '../../resources/api';

const headerColors = ['#F3C5C5', '#FADFC1', '#D5D2FD', '#BFF0DB', '#B1CBE8', '#F2F2D0'];

const Columns = ({ setShowModalId }: { setShowModalId: (showModalId: number | null) => void }) => {
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { columns: columnsData, tasks: tasksData } = await fetchColumnsAndTasks();
        
        setColumns(columnsData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='Columns'>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading columns and tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='Columns'>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>Error: {error}</p>
          <p>Make sure your API server is running on port 3301</p>
        </div>
      </div>
    );
  }

  return (
    <div className='Columns'>
      {columns.map((column) => (
        <div key={column.id} className='Column'>
          <div className='Column-header' style={{ backgroundColor: headerColors[column.id - 1] }}>
            <div className='Title-count'>
              <h3>{column.name}</h3>
              <h3 className='Column-header-count'>{tasks.filter((task) => task.columnId === column.id).length}</h3>
            </div>
            <h3 className='Column-header-button'><FontAwesomeIcon icon={faPlus} /></h3>
          </div>
          <Cards columnId={column.id} tasks={tasks} setShowModalId={setShowModalId} />
          <div className='New-task-button' onClick={() => {
            console.log('Adding new task')
          }}>
            <FontAwesomeIcon color='grey' icon={faPlus} style={{ marginLeft: '16px' }} />
            <p>New task</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Columns