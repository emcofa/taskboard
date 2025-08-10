import React, { useState } from 'react'
import './taskModal.scss'
import { createTask } from '../resources/api';
import { TaskColumn } from '../resources/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface AddTaskModalProps {
    columnPosition: number;
    columns: TaskColumn[];
    onClose: () => void;
    onTaskCreated?: () => void;
}

const AddTaskModal = ({ columnPosition, columns, onClose, onTaskCreated }: AddTaskModalProps) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        columnPosition: columnPosition
    });

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('Task title is required');
            return;
        }

        try {
            setIsCreating(true);
            await createTask({
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                columnPosition: formData.columnPosition,
                dueDate: formData.dueDate || undefined
            });
            
            if (onTaskCreated) {
                onTaskCreated();
            }
            
            onClose();
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task. Please try again.');
        } finally {
            setIsCreating(false);
        }
    }

    const handleCancel = () => {
        onClose();
    }

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Task</h2>
                    <div className="modal-header-buttons">
                        <button 
                            className="close-button" 
                            onClick={handleSave}
                            disabled={isCreating}
                        >
                            <FontAwesomeIcon size='sm' icon={faSave} />
                        </button>
                        <button className="close-button" onClick={handleCancel}>
                            <FontAwesomeIcon size='sm' icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="modal-body-header">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="edit-input title-input"
                            placeholder="Task title"
                            autoFocus
                        />
                    </div>
                    <div className="modal-body-content">
                        <div className="column-selector-container">
                            <label htmlFor="columnSelect">Column:</label>
                            <select
                                id="columnSelect"
                                value={formData.columnPosition}
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
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="edit-input description-input"
                            placeholder="Task description (optional)"
                            rows={4}
                        />
                        <div className="due-date-input-container">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                className="edit-input due-date-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTaskModal 