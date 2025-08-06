import React, { useState } from 'react'
import './columns.scss'
import Cards from '../Cards/Cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task, TaskColumn } from '../../resources/types';
import AddTaskModal from '../../Modals/AddTaskModal';

const headerColors = ['#F3C5C5', '#FADFC1', '#D5D2FD', '#BFF0DB', '#B1CBE8', '#F2F2D0'];

interface ColumnsProps {
  setShowModalId: (showModalId: number | null) => void;
  tasks: Task[];
  columns: TaskColumn[];
  onTaskCreated: () => void;
}

const Columns = ({ setShowModalId, tasks, columns, onTaskCreated }: ColumnsProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const handleAddTask = (columnId: number) => {
    setSelectedColumnId(columnId);
    setShowAddTaskModal(true);
  };

  const handleTaskCreated = () => {
    onTaskCreated();
    setShowAddTaskModal(false);
    setSelectedColumnId(null);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setSelectedColumnId(null);
  };

  return (
    <div className='Columns'>
      {columns.map((column) => (
        <div key={column.id} className='Column'>
          <div className='Column-header' style={{ backgroundColor: headerColors[column.id - 1] }}>
            <div className='Title-count'>
              <h3>{column.name}</h3>
              <h3 className='Column-header-count'>{tasks.filter((task) => task.columnId === column.id).length}</h3>
            </div>
            <h3 className='Column-header-button' onClick={() => handleAddTask(column.id)}>
              <FontAwesomeIcon icon={faPlus} />
            </h3>
          </div>
          <Cards columnId={column.id} tasks={tasks} setShowModalId={setShowModalId} />
          <div className='New-task-button' onClick={() => handleAddTask(column.id)}>
            <FontAwesomeIcon color='grey' icon={faPlus} style={{ marginLeft: '16px' }} />
            <p>New task</p>
          </div>
        </div>
      ))}
      
      {showAddTaskModal && selectedColumnId && (
        <AddTaskModal
          columnId={selectedColumnId}
          columns={columns}
          onClose={handleCloseAddTaskModal}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  )
}

export default Columns