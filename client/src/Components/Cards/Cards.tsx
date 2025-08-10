import React from 'react'
import './cards.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import { Tooltip } from 'react-tooltip'
import { updateTask } from '../../resources/api';


type Task = {
  id: number;
  title: string;
  description?: string;
  columnPosition: number;
  created: string;
  dueDate?: string | null;
}

type Props = {
  columnPosition: number;
  tasks: Task[];
  setShowModalId: (showModalId: number | null) => void;
  onTaskUpdated?: () => void;
};

const calculateDaysLeft = (dueDate?: string | null): number => {
  if (!dueDate) return 0;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDaysLeft = (days: number): string => {
  const absDays = Math.abs(days);
  const dayLabel = absDays === 1 ? 'day' : 'days';
  return days < 0 ? `${absDays} ${dayLabel} overdue` : `${absDays} ${dayLabel} left`;
};

const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const handleArchiveTask = async (
  taskId: number, 
  onTaskUpdated?: () => void,
  event?: React.MouseEvent
) => {
  if (event) {
    event.stopPropagation();
  }
  
  try {
    await updateTask(taskId, { columnPosition: 5 });
    onTaskUpdated?.();
  } catch (error) {
    console.error('Failed to archive task:', error);
  }
};

const DraggableCard = ({ task, setShowModalId, onTaskUpdated }: { task: Task; setShowModalId: (showModalId: number | null) => void; onTaskUpdated?: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: task.id.toString() });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    visibility: isDragging ? 'hidden' as const : 'visible' as const,
    pointerEvents: isDragging ? 'none' as const : 'auto' as const,
  };

  const daysLeft = calculateDaysLeft(task.dueDate);
  const showDue = task.dueDate !== null && task.columnPosition !== 4 && task.columnPosition !== 5;
  const isDoneTask = task.columnPosition === 4;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='Card'
      onClick={() => setShowModalId(task.id)}
    >
      <div className='Card-header'>
        <h3>{task.title}</h3>
        {isDoneTask ?
          <div>
            <FontAwesomeIcon icon={faBoxArchive} color='grey' size='sm' data-tooltip-id='archive-tooltip' className='archive-icon' onClick={async (e) => {
              await handleArchiveTask(task.id, onTaskUpdated, e);
            }}
              data-tooltip-content='Archive task' />
            <Tooltip id='archive-tooltip' place='top' />
          </div>
          : null}
      </div>
      <p>{truncateText(task.description || '', 100)}</p>
      {showDue ? (
        <div className='due-date-container'>
          <FontAwesomeIcon icon={faCalendarDays} color='grey' size='sm' />
          <p style={{ color: daysLeft < 0 ? 'red' : 'inherit' }}>
            {formatDaysLeft(daysLeft)}
          </p>
        </div>
      ) : null}
    </div>
  );
};

const Cards = ({ columnPosition, tasks, setShowModalId, onTaskUpdated }: Props) => {
  const columnTasks = tasks.filter(task => task.columnPosition === columnPosition);

  return (
    <div className='Cards'>
      {columnTasks.map(task => (
        <DraggableCard key={task.id} task={task} setShowModalId={setShowModalId} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  );
}

export default Cards