import React, { useEffect, useState } from 'react'
import './taskModal.scss'
import { fetchTask, deleteTask, updateTask } from '../resources/api';
import { Task } from '../resources/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPenToSquare, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TaskModalProps {
    taskId: number;
    onClose: () => void;
    onDelete?: () => void;
    onUpdate?: () => void;
}

const TaskModal = ({ taskId, onClose, onDelete, onUpdate }: TaskModalProps) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const [task, setTask] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    useEffect(() => {
        const fetchTaskData = async () => {
            const taskData = await fetchTask(taskId);
            setTask(taskData);
            setEditForm({
                title: taskData.title,
                description: taskData.description || '',
                dueDate: taskData.dueDate || ''
            });
        }
        fetchTaskData();
    }, [taskId]);

    const handleDelete = async () => {
        if (!task) return;
        
        const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await deleteTask(taskId);
            
            if (onDelete) {
                onDelete();
            }
            
            onClose();
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = async () => {
        if (!task) return;

        try {
            setIsUpdating(true);
            const updatedTask = await updateTask(taskId, {
                title: editForm.title,
                description: editForm.description,
                dueDate: editForm.dueDate || null
            });
            
            setTask(updatedTask);
            setIsEditing(false);
            
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to update task. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    }

    const handleCancel = () => {
        if (task) {
            setEditForm({
                title: task.title,
                description: task.description || '',
                dueDate: task.dueDate || ''
            });
        }
        setIsEditing(false);
    }

    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    if (!task) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Details</h2>
                    <div className="modal-header-buttons">
                        {!isEditing ? (
                            <>
                                <button className="close-button" onClick={handleEdit}>
                                    <FontAwesomeIcon size='sm' icon={faPenToSquare} />
                                </button>
                                <button 
                                    className="close-button" 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <FontAwesomeIcon size='sm' icon={faTrash} />
                                </button>
                                <button className="close-button" onClick={onClose}>
                                    <FontAwesomeIcon size='sm' icon={faX} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="close-button" 
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                >
                                    <FontAwesomeIcon size='sm' icon={faSave} />
                                </button>
                                <button className="close-button" onClick={handleCancel}>
                                    <FontAwesomeIcon size='sm' icon={faTimes} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="modal-body">
                    <div className="modal-body-header">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="edit-input title-input"
                                placeholder="Task title"
                            />
                        ) : (
                            <h3>{task.title}</h3>
                        )}
                    </div>
                    <div className="modal-body-content">
                        {isEditing ? (
                            <>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="edit-input description-input"
                                    placeholder="Task description"
                                    rows={4}
                                />
                                <div className="due-date-input-container">
                                    <label htmlFor="dueDate">Due Date:</label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        value={editForm.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        className="edit-input due-date-input"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{task.description}</p>
                                <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal