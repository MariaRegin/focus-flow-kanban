import { create } from "zustand";
import type { Task, Status } from "../types/types";
import type { User } from "@supabase/supabase-js";

interface TaskStore {
  tasks: Task[];
  user: User | null;
  setTasks: (newTasks: Task[]) => void;
  setUser: (user: User | null) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  user: null,
  setTasks: (newTasks) => set({ tasks: newTasks }),
  setUser: (user) => set({ user }),
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
