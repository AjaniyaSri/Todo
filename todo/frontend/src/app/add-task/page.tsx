"use client";
import React from "react";
import AddTaskPage from "../../components/AddTaskPage";
import { useTasks } from "../../context/TaskContext";

export default function AddTask() {
  const { addTask } = useTasks();

  return <AddTaskPage addTask={addTask} />;
} 