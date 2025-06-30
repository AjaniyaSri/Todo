import './TaskCount.css';

interface Task {
  completed: boolean;
  [key: string]: any;
}

interface TaskCountProps {
  tasks: Task[];
}

function TaskCount({ tasks }: TaskCountProps) {
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