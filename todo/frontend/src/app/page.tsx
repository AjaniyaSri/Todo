"use client";
import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import TaskItem from "../components/TaskItem";
import { useTasks } from "../context/TaskContext";
import type { Task } from "../context/TaskContext";
import "../components/Dashboard.css";
import "../components/TaskItem.css";
import SearchTasks from "../components/SearchTasks";

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
  const { tasks, deleteTask, toggleComplete, editTask, searchTerm, setSearchTerm, currentPage, setCurrentPage, tasksPerPage } = useTasks();
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0].label);
  const [sort, setSort] = useState("default");
  const [modalTask, setModalTask] = useState<Task | null>(null);

  // 1. Apply search
  let filtered = tasks;
  if (searchTerm.trim() !== "") {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(task =>
      task.text.toLowerCase().includes(searchLower) ||
      task.category?.toLowerCase().includes(searchLower) ||
      task.priority?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower)
    );
  }

  // 2. Apply selected filter
  const currentFilter = FILTERS.find(f => f.label === selectedFilter) || FILTERS[0];
  filtered = filtered.filter(currentFilter.filter);

  // 3. Apply sort
  if (sort === "dueDate") {
    filtered = [...filtered].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    });
  } else if (sort === "alphabetical") {
    filtered = [...filtered].sort((a, b) => {
      const textA = (a.text || '').toLowerCase();
      const textB = (b.text || '').toLowerCase();
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    });
  } else if (sort === "category") {
    filtered = [...filtered].sort((a, b) => {
      const catA = (a.category || '').toLowerCase();
      const catB = (b.category || '').toLowerCase();
      if (catA < catB) return -1;
      if (catA > catB) return 1;
      return 0;
    });
  }

  // 4. Paginate
  const totalPages = Math.ceil(filtered.length / tasksPerPage);
  const paginatedTasks = filtered.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <div className="app">
      <div className="main-content">
        {/* Add space above the search bar */}
        <div style={{ marginTop: '2rem' }}>
          <SearchTasks search={searchTerm} setSearch={setSearchTerm} sort={sort} setSort={setSort} />
        </div>
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
              onClick={() => { setSelectedFilter(f.label); setCurrentPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </nav>
        {/* Render modal at the top level so it overlays all content */}
        {modalTask && (
          <TaskItem
            task={modalTask}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            editTask={editTask}
            isModal
            onClose={() => setModalTask(null)}
          />
        )}
        <div style={{ margin: '2rem 0' }}>
          {paginatedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem' }}>No tasks for this filter.</div>
          ) : (
            paginatedTasks.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
                editTask={editTask}
                onShowDetails={() => setModalTask(task)}
              />
            ))
          )}
        </div>
        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&lt; Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &gt;</button>
        </div>
      </div>
    </div>
  );
}
