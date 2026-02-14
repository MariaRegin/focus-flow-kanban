import { create } from "zustand";
import type { Task, Status } from "../types/types";

interface TaskStore {
  tasks: Task[];
  setTasks: (newTasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (newTasks) => set({ tasks: newTasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: status } : task,
      ),
    })),
}));
