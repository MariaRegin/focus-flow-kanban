import { create } from "zustand";
import type { Task } from "../types/types";

interface TaskStore {
  tasks: Task[];
  setTasks: (newTasks: Task[]) => void;
  addTask: (task: Task) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (newTasks) => set({ tasks: newTasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
}));
