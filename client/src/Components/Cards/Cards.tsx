import React, { useState } from 'react'
import './cards.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

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


const Cards = ({ columnId, tasks, setShowModalId }: Props) => {
  return (
    <div className='Cards'>
      {tasks
        .filter(task => task.columnId === columnId)
        .map(task => {
          const daysLeft = calculateDaysLeft(task.dueDate);
          const showDue = task.dueDate !== null && columnId !== 4;

          return (
            <div key={task.id} className='Card' onClick={() => {
              setShowModalId(task.id);
            }}>
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
        })}
    </div>
  );
}

export default Cards