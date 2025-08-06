import React, { useState, useEffect } from 'react'
import './board.scss'
import Columns from '../Columns/Columns'
import TaskModal from '../../Modals/TaskModal';
import { TaskColumn, Task } from '../../resources/types';
import { fetchColumnsAndTasks, moveTask } from '../../resources/api';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const Board = () => {
  const [showModalId, setShowModalId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const { columns: columnsData, tasks: tasksData } = await fetchColumnsAndTasks();
      setColumns(columnsData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === parseInt(active.id as string));
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = parseInt(active.id as string);
    const newColumnId = parseInt(over.id as string);

    // Check if the task is being moved to a different column
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask || currentTask.columnId === newColumnId) return;

    try {
      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, columnId: newColumnId } : task
        )
      );

      // Make the API call
      await moveTask(taskId, newColumnId);
      
      // Refresh data to ensure consistency
      fetchData();
    } catch (error) {
      console.error('Failed to move task:', error);
      // Revert the optimistic update on error
      fetchData();
    }
  };

  const handleCloseModal = () => {
    setShowModalId(null);
  };

  const handleTaskDelete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className='Board'>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='Board'>
        <Columns 
          key={refreshKey} 
          setShowModalId={setShowModalId}
          tasks={tasks}
          columns={columns}
          onTaskCreated={handleTaskCreated}
        />
        {showModalId ? (
          <TaskModal 
            taskId={showModalId} 
            columns={columns}
            onClose={handleCloseModal} 
            onDelete={handleTaskDelete} 
            onUpdate={handleTaskUpdate} 
          />
        ) : null}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <div className="drag-overlay">
            <h3>{activeTask.title}</h3>
            <p>{activeTask.description}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board