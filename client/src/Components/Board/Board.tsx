import React, { useState } from 'react'
import './board.scss'
import Columns from '../Columns/Columns'
import TaskModal from '../../Modals/TaskModal';

const Board = () => {
  const [showModalId, setShowModalId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCloseModal = () => {
    setShowModalId(null);
  };

  const handleTaskDelete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className='Board'>
        <Columns key={refreshKey} setShowModalId={setShowModalId} />
        {showModalId ? <TaskModal taskId={showModalId} onClose={handleCloseModal} onDelete={handleTaskDelete} onUpdate={handleTaskUpdate} /> : null}
    </div>
  )
}

export default Board