import React, { useState } from 'react'
import './columns.scss'
import Cards from '../Cards/Cards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task, TaskColumn } from '../../resources/types';
import AddTaskModal from '../../Modals/AddTaskModal';
import { Tooltip } from 'react-tooltip'
import { useDroppable } from '@dnd-kit/core';


const headerColors = ['#F3C5C5', '#FADFC1', '#D5D2FD', '#BFF0DB', '#B1CBE8', '#F2F2D0'];

interface ColumnProps {
  column: TaskColumn;
  tasks: Task[];
  setShowModalId: (showModalId: number | null) => void;
  onTaskUpdated?: () => void;
  onAddTask: (columnPosition: number) => void;
  showArchiveColumn: boolean;
  setShowArchiveColumn: (show: boolean) => void;
}

const Column = ({ column, tasks, setShowModalId, onTaskUpdated, onAddTask, showArchiveColumn, setShowArchiveColumn }: ColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.position.toString(),
  });

  const isArchived = column.position === 5;

  return (
    <div className='Column' ref={setNodeRef}>
      <div className='Column-header' style={{ backgroundColor: headerColors[column.position - 1] }}>
        <div className='Title-count'>
          <h3>{column.name}</h3>
          <h3 className='Column-header-count'>{tasks.filter((task) => task.columnPosition === column.position).length}</h3>
        </div>
        <div className='Column-header-buttons'>
          {!isArchived ? <h3 className='Column-header-button'>
            <FontAwesomeIcon onClick={() => onAddTask(column.position)} icon={faPlus} data-tooltip-id='add-task' data-tooltip-content='Add task' />
          </h3> : null}
          {column.position === 4 || showArchiveColumn ?
            <p onClick={() => setShowArchiveColumn(!showArchiveColumn)}>{showArchiveColumn ? 'Hide archived tasks' : 'Show archived tasks'}</p>
            : null}
        </div>
      </div>
      <Cards columnPosition={column.position} tasks={tasks} setShowModalId={setShowModalId} onTaskUpdated={onTaskUpdated} />
    </div>
  );
};

interface ColumnsProps {
  setShowModalId: (showModalId: number | null) => void;
  tasks: Task[];
  columns: TaskColumn[];
  onTaskCreated: () => void;
  onTaskUpdated?: () => void;
}

const Columns = ({ setShowModalId, tasks, columns, onTaskCreated, onTaskUpdated }: ColumnsProps) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnPosition, setSelectedColumnPosition] = useState<number | null>(null);
  const [showArchiveColumn, setShowArchiveColumn] = useState(false);

  const handleAddTask = (columnPosition: number) => {
    setSelectedColumnPosition(columnPosition);
    setShowAddTaskModal(true);
  };

  const handleTaskCreated = () => {
    onTaskCreated();
    setShowAddTaskModal(false);
    setSelectedColumnPosition(null);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setSelectedColumnPosition(null);
  };

  return (
    <div className='Columns'>
      {columns.filter((column) => column.position !== 5 && !showArchiveColumn || showArchiveColumn && column.position === 5).map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks}
          setShowModalId={setShowModalId}
          onTaskUpdated={onTaskUpdated}
          onAddTask={handleAddTask}
          showArchiveColumn={showArchiveColumn}
          setShowArchiveColumn={setShowArchiveColumn}
        />
      ))}

      {showAddTaskModal && selectedColumnPosition && (
        <AddTaskModal
          columnPosition={selectedColumnPosition}
          columns={columns}
          onClose={handleCloseAddTaskModal}
          onTaskCreated={handleTaskCreated}
        />
      )}
      <Tooltip id='add-task' place='top' />
    </div>
  )
}

export default Columns