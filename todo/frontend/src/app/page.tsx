"use client";
import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import TaskItem from "../components/TaskItem";
import { useTasks } from "../context/TaskContext";
import type { Task } from "../context/TaskContext";
import "../components/Dashboard.css";
import "../components/TaskItem.css";

const FILTERS: { label: string; filter: (task: Task) => boolean }[] = [
  { label: "All Tasks", filter: () => true },
  { label: "Active", filter: (task: Task) => !task.completed },
  { label: "Completed", filter: (task: Task) => task.completed },
  { label: "Overdue", filter: (task: Task) => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate!);
    return dueDate < today;
  } },
  { label: "Due Today", filter: (task: Task) => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate!);
    return dueDate.toDateString() === today.toDateString();
  } },
  { label: "Upcoming", filter: (task: Task) => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate!);
    return dueDate > today;
  } },
];

export default function Home() {
  const { tasks, deleteTask, toggleComplete, editTask } = useTasks();
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0].label);

  const currentFilter = FILTERS.find(f => f.label === selectedFilter) || FILTERS[0];
  const filteredTasks = tasks.filter(currentFilter.filter);

  return (
    <div className="app">
      <div className="main-content">
        <Dashboard tasks={tasks} />
        {/* Horizontal filter bar (after dashboard) */}
        <nav className="filter-navbar" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', margin: '2rem 0 1.5rem 0', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.label}
              className={`filter-navbar-btn${selectedFilter === f.label ? ' active' : ''}`}
              style={{
                background: selectedFilter === f.label ? '#4a90e2' : 'transparent',
                color: '#fff',
                border: 'none',
                borderBottom: selectedFilter === f.label ? '3px solid #4a90e2' : '3px solid transparent',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0.5rem 1.25rem',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onClick={() => setSelectedFilter(f.label)}
            >
              {f.label}
            </button>
          ))}
        </nav>
        <div style={{ margin: '2rem 0' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem' }}>No tasks for this filter.</div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
                editTask={editTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
