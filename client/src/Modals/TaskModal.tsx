import React, { useEffect, useState } from 'react'
import './taskModal.scss'
import { fetchTask, deleteTask, updateTask } from '../resources/api';
import { Task, TaskColumn } from '../resources/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPenToSquare, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import moment from 'moment';

interface TaskModalProps {
    taskId: number;
    columns: TaskColumn[];
    onClose: () => void;
    onDelete?: () => void;
    onUpdate?: () => void;
}

const TaskModal = ({ taskId, columns, onClose, onDelete, onUpdate }: TaskModalProps) => {
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
        dueDate: '',
        columnPosition: 0
    });

    useEffect(() => {
        const fetchTaskData = async () => {
            const taskData = await fetchTask(taskId);
            setTask(taskData);
            setEditForm({
                title: taskData.title,
                description: taskData.description || '',
                dueDate: taskData.dueDate || '',
                columnPosition: taskData.columnPosition
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
                dueDate: editForm.dueDate || null,
                columnPosition: editForm.columnPosition
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
                dueDate: task.dueDate || '',
                columnPosition: task.columnPosition
            });
        }
        setIsEditing(false);
    }

    const handleInputChange = (field: string, value: string | number) => {
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
                                <button className="close-button" onClick={handleEdit} data-tooltip-id='edit-tooltip' data-tooltip-content='Edit'>
                                    <FontAwesomeIcon size='sm' icon={faPenToSquare} />
                                    <Tooltip id='edit-tooltip' place='top' />
                                </button>
                                <button
                                    className="close-button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    data-tooltip-id='delete-tooltip'
                                    data-tooltip-content='Delete'
                                >
                                    <FontAwesomeIcon size='sm' icon={faTrash} />
                                    <Tooltip id='delete-tooltip' place='top' />
                                </button>
                                <button className="close-button" onClick={onClose} data-tooltip-id='close-tooltip' data-tooltip-content='Close'>
                                    <FontAwesomeIcon size='sm' icon={faX} />
                                    <Tooltip id='close-tooltip' place='top' />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="close-button"
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                    data-tooltip-id='save-tooltip'
                                    data-tooltip-content='Save'
                                >
                                    <FontAwesomeIcon size='sm' icon={faSave} />
                                    <Tooltip id='save-tooltip' place='top' />
                                </button>
                                <button className="close-button" onClick={handleCancel} data-tooltip-id='cancel-tooltip' data-tooltip-content='Cancel'>
                                    <FontAwesomeIcon size='sm' icon={faTimes} />
                                    <Tooltip id='cancel-tooltip' place='top' />
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
                            <b> {task.title}</b>
                        )}
                    </div>
                    <div className="modal-body-content">
                        {isEditing ? (
                            <>
                                <div className="column-selector-container">
                                    <label htmlFor="columnSelect">Status</label>
                                    <select
                                        id="columnSelect"
                                        value={editForm.columnPosition}
                                        onChange={(e) => handleInputChange('columnPosition', parseInt(e.target.value))}
                                        className="edit-input column-select-input"
                                    >
                                        {columns.map((column) => (
                                            <option key={column.id} value={column.position}>
                                                {column.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="column-selector-container">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="edit-input description-input"
                                        placeholder="Task description"
                                        rows={4}
                                    />
                                </div>
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
                                {task.dueDate ? (
                                    <p><b>Due Date:</b> {moment(task.dueDate).format('YYYY-MM-DD')}</p>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal