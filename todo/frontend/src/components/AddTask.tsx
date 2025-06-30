import { useState } from 'react';
import './AddTask.css';

interface AddTaskProps {
  addTask: (text: string, dueDate: string, category: string) => void;
}

function AddTask({ addTask }: AddTaskProps) {
  const [text, setText] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [category, setCategory] = useState<string>('None');

  const handleSubmit = () => {
    addTask(text, dueDate, category);
    setText('');
    setDueDate('');
    setCategory('None');
  };

  return (
    <div className="add-task">
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task"
          className="task-input"
          aria-label="New task input"
        />
        <button onClick={handleSubmit} className="add-button" aria-label="Add task">
          Add
        </button>
      </div>
      <div className="extra-inputs">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
          aria-label="Task due date"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
          aria-label="Task category"
        >
          <option value="None">No Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
    </div>
  );
}

export default AddTask; 