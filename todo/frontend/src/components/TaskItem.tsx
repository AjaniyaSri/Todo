import React, { useState, useEffect } from 'react';
import './TaskItem.css';
import type { Task } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  deleteTask: (id: string | number) => Promise<void>;
  toggleComplete: (id: string | number) => Promise<void>;
  editTask: (id: string | number, text: string, dueDate: string, category: string) => Promise<void>;
  isModal?: boolean;
  onClose?: () => void;
  onShowDetails?: () => void;
}

function TaskItem({ task, deleteTask, toggleComplete, editTask, isModal = false, onClose, onShowDetails }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editCategory, setEditCategory] = useState(task.category || 'None');
  const [showDetails, setShowDetails] = useState(false);

  // Add/remove modal-open class to body
  useEffect(() => {
    if ((isModal && onClose) || showDetails) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModal, onClose, showDetails]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await editTask(task.id || task._id || '', editText, editDueDate, editCategory);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditDueDate(task.dueDate || '');
    setEditCategory(task.category || 'None');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id || task._id || '');
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(task.id || task._id || '');
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityText = (priority?: string) => {
    return priority || 'Medium';
  };

  if (isModal && onClose) {
    return (
      <div className="task-details-modal" onClick={onClose}>
        <div className="task-details-content" onClick={e => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>&times;</button>
          <h3>Task Details</h3>
          {isEditing ? (
            <form
              className="task-edit-form"
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <input
                className="edit-input"
                type="text"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                required
              />
              <input
                className="edit-date"
                type="date"
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
              />
              <select
                className="edit-category"
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
              >
                <option value="None">No Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
              <div className="edit-buttons">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="detail-section">
                <label>Task:</label>
                <p className="detail-text">{task.text}</p>
              </div>
              {task.description && (
                <div className="detail-section">
                  <label>Description:</label>
                  <p className="detail-text">{task.description}</p>
                </div>
              )}
              <div className="detail-section">
                <label>Status:</label>
                <span className={`status-badge ${task.completed ? 'completed' : 'active'}`}>{task.completed ? 'Completed' : 'Active'}</span>
              </div>
              <div className="detail-section">
                <label>Priority:</label>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>{getPriorityText(task.priority)}</span>
              </div>
              <div className="detail-section">
                <label>Category:</label>
                <span className="category-badge">{task.category || 'None'}</span>
              </div>
              <div className="detail-section">
                <label>Due Date:</label>
                <span className="due-date-badge">{formatDate(task.dueDate)}</span>
              </div>
              {task.createdAt && (
                <div className="detail-section">
                  <label>Created:</label>
                  <span className="date-badge">{formatDate(task.createdAt)}</span>
                </div>
              )}
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div className="detail-section">
                  <label>Last Updated:</label>
                  <span className="date-badge">{formatDate(task.updatedAt)}</span>
                </div>
              )}
              <div className="detail-actions">
                <button onClick={handleEdit} className="edit-button">Edit Task</button>
                <button onClick={handleDelete} className="delete-button">Delete Task</button>
                <button onClick={onClose} className="close-button">Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isModal && isEditing) {
    return (
      <div className="task-item editing">
        <form
          className="task-edit-form"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            className="edit-input"
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            required
          />
          <input
            className="edit-date"
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
          />
          <select
            className="edit-category"
            value={editCategory}
            onChange={e => setEditCategory(e.target.value)}
          >
            <option value="None">No Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
          <div className="edit-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="task-item">
      <div className="task-content" onClick={onShowDetails ? onShowDetails : () => setShowDetails(!showDetails)}>
        <div className="task-main">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="task-checkbox"
          />
          <span 
            className={`task-text ${task.completed ? 'completed' : ''}`}
          >
            {task.text}
          </span>
        </div>
        
        <div className="task-meta">
          {task.dueDate && (
            <span className="task-due-date">
              Due: {formatDate(task.dueDate)}
            </span>
          )}
          {task.category && task.category !== 'None' && (
            <span className="task-category">
              {task.category}
            </span>
          )}
          <span 
            className="task-priority"
            style={{ color: getPriorityColor(task.priority) }}
          >
            {getPriorityText(task.priority)}
          </span>
        </div>
      </div>

      {/* Task Details Modal */}
      {showDetails && !onShowDetails && (
        <div className="task-details-modal" onClick={() => setShowDetails(false)}>
          <div className="task-details-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowDetails(false)}>&times;</button>
            <h3>Task Details</h3>
            
            <div className="detail-section">
              <label>Task:</label>
              <p className="detail-text">{task.text}</p>
            </div>

            {task.description && (
              <div className="detail-section">
                <label>Description:</label>
                <p className="detail-text">{task.description}</p>
              </div>
            )}

            <div className="detail-section">
              <label>Status:</label>
              <span className={`status-badge ${task.completed ? 'completed' : 'active'}`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>

            <div className="detail-section">
              <label>Priority:</label>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {getPriorityText(task.priority)}
              </span>
            </div>

            <div className="detail-section">
              <label>Category:</label>
              <span className="category-badge">{task.category || 'None'}</span>
            </div>

            <div className="detail-section">
              <label>Due Date:</label>
              <span className="due-date-badge">{formatDate(task.dueDate)}</span>
            </div>

            {task.createdAt && (
              <div className="detail-section">
                <label>Created:</label>
                <span className="date-badge">{formatDate(task.createdAt)}</span>
              </div>
            )}

            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div className="detail-section">
                <label>Last Updated:</label>
                <span className="date-badge">{formatDate(task.updatedAt)}</span>
              </div>
            )}

            <div className="detail-actions">
              <button onClick={handleEdit} className="edit-button">Edit Task</button>
              <button onClick={handleDelete} className="delete-button">Delete Task</button>
              <button onClick={() => setShowDetails(false)} className="close-button">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="task-actions">
        <button onClick={handleEdit} className="edit-button">Edit</button>
        <button onClick={handleDelete} className="delete-button">Delete</button>
      </div>
    </div>
  );
}

export default TaskItem; 