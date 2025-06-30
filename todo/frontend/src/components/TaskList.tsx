import TaskItem from './TaskItem';
import './TaskList.css';

import type { Task } from '../context/TaskContext';

interface TaskListProps {
  tasks: Task[];
  deleteTask: (id: string | number) => Promise<void>;
  toggleComplete: (id: string | number) => Promise<void>;
  editTask: (id: string | number, text: string, dueDate: string, category: string) => Promise<void>;
}

function TaskList({ tasks, deleteTask, toggleComplete, editTask }: TaskListProps) {
  // Remove duplicate tasks based on _id
  const uniqueTasks = tasks.filter((task, index, self) => 
    index === self.findIndex(t => t._id === task._id)
  );

  return (
    <ul className="task-list">
      {uniqueTasks.map((task, index) => (
        <TaskItem
          key={`${task._id || task.id}-${index}`}
          task={task}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
        />
      ))}
    </ul>
  );
}

export default TaskList; 