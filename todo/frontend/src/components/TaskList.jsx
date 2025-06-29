import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, deleteTask, toggleComplete, editTask }) {
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