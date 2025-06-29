import './TaskCount.css';

function TaskCount({ tasks }) {
  const total = tasks.length;
  const active = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;

  return (
    <div className="task-count">
      Total: {total} | Active: {active} | Completed: {completed}
    </div>
  );
}

export default TaskCount;