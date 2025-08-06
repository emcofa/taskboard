import React from 'react'
import './cards.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

type Task = {
  id: number;
  title: string;
  description?: string;
  columnId: number;
  created: string;
  dueDate?: string | null;
}

type Props = {
  columnId: number;
  tasks: Task[];
  setShowModalId: (showModalId: number | null) => void;
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

// Draggable Card Component
const DraggableCard = ({ task, setShowModalId }: { task: Task; setShowModalId: (showModalId: number | null) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const daysLeft = calculateDaysLeft(task.dueDate);
  const showDue = task.dueDate !== null && task.columnId !== 4;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='Card'
      onClick={() => setShowModalId(task.id)}
    >
      <h3>{task.title}</h3>
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

const Cards = ({ columnId, tasks, setShowModalId }: Props) => {
  const { setNodeRef } = useDroppable({
    id: columnId.toString(),
  });

  const columnTasks = tasks.filter(task => task.columnId === columnId);

  return (
    <div ref={setNodeRef} className='Cards'>
      {columnTasks.map(task => (
        <DraggableCard key={task.id} task={task} setShowModalId={setShowModalId} />
      ))}
    </div>
  );
}

export default Cards