import { create } from "zustand";
import type { Task, Status } from "../types/types";
import type { User } from "@supabase/supabase-js";

interface TaskStore {
  tasks: Task[];
  user: User | null;
  setUser: (user: User | null) => void;
  setTasks: (newTasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  user: null,
  setUser: (user) => set({ user }),
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
