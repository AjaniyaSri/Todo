"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export interface Task {
  _id?: string; // MongoDB ObjectId
  id?: string | number; // Frontend ID (for compatibility)
  text: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
  priority?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  paginatedTasks: Task[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  tasksPerPage: number;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  addTask: (text: string, dueDate: string, category: string) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;
  toggleComplete: (id: string | number) => Promise<void>;
  editTask: (id: string | number, text: string, dueDate: string, category: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Backend API URL
const API_BASE_URL = 'http://localhost:5000/api/tasks';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) {
      return tasks;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.text.toLowerCase().includes(searchLower) ||
      task.category?.toLowerCase().includes(searchLower) ||
      task.priority?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower)
    );
  }, [tasks, searchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Get paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage, tasksPerPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (text: string, dueDate: string, category: string) => {
    try {
      setError(null);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          dueDate: dueDate || null,
          category: category || 'None',
          completed: false,
          priority: 'Medium',
          description: ''
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Failed to add task: ${response.status} ${errorText}`);
      }

      const newTask = await response.json();
      
      // Check if task already exists to prevent duplicates
      setTasks(prev => {
        const exists = prev.some(task => task._id === newTask._id);
        if (exists) {
          console.log('Task already exists, not adding duplicate');
          return prev;
        }
        return [...prev, newTask];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === id || t._id === id);
      if (!task) return;

      const taskId = task._id || task.id;
      if (!taskId) return;

      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Failed to delete task: ${response.status} ${errorText}`);
      }

      setTasks(prev => prev.filter(task => task.id !== id && task._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const toggleComplete = async (id: string | number) => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === id || t._id === id);
      if (!task) return;

      // Use MongoDB _id if available, otherwise use frontend id
      const taskId = task._id || task.id;
      if (!taskId) return;

      console.log('Toggling task:', { id, taskId, currentCompleted: task.completed, newCompleted: !task.completed });

      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: task.text,
          completed: !task.completed,
          dueDate: task.dueDate || null,
          category: task.category || 'None',
          priority: task.priority || 'Medium',
          description: task.description || ''
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Failed to update task: ${response.status} ${errorText}`);
      }

      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      setTasks(prev => prev.map(task =>
        (task.id === id || task._id === id) ? updatedTask : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const editTask = async (id: string | number, text: string, dueDate: string, category: string) => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === id || t._id === id);
      if (!task) return;

      const taskId = task._id || task.id;
      if (!taskId) return;

      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          completed: task.completed,
          dueDate: dueDate || null,
          category: category || 'None',
          priority: task.priority || 'Medium',
          description: task.description || ''
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Failed to update task: ${response.status} ${errorText}`);
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task =>
        (task.id === id || task._id === id) ? updatedTask : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const refreshTasks = async () => {
    await fetchTasks();
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      filteredTasks, 
      paginatedTasks, 
      loading, 
      error, 
      searchTerm, 
      currentPage, 
      totalPages, 
      tasksPerPage, 
      setSearchTerm, 
      setCurrentPage, 
      addTask, 
      deleteTask, 
      toggleComplete, 
      editTask, 
      refreshTasks 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 