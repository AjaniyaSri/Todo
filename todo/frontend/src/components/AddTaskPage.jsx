import { useState } from "react";
import { useRouter } from "next/navigation";
import "./AddTaskPage.css";

function AddTaskPage({ addTask }) {
  const router = useRouter();
  const [taskData, setTaskData] = useState({
    text: "",
    dueDate: "",
    category: "None",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.text.trim()) {
      setError("Task description is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await addTask(taskData.text, taskData.dueDate, taskData.category);
      router.push("/");
    } catch (err) {
      setError("Failed to add task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  return (
    <div className="add-task-page">
      <div className="add-task-container">
        <div className="add-task-header">
          <h1>Create New Task</h1>
          <button className="back-button" onClick={() => router.push("/")}>Back to Tasks</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <label htmlFor="text">What needs to be done?</label>
            <textarea
              id="text"
              name="text"
              value={taskData.text}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="3"
              className="task-input"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">When is it due?</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className="date-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={taskData.category}
                onChange={handleChange}
                className="category-select"
              >
                <option value="None">None</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskPage;
