import type { Task, Status } from "../types/types";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}

function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <span className="font-medium text-gray-200 leading-tight">
          {task.title}
        </span>
        <button
          className="shrink-0 text-red-500 hover:text-red-400 hover:bg-red-900/30 p-1.5 rounded transition-colors"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <select
        className="bg-gray-700 text-xs p-1 rounded ml-2 cursor-pointer"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
      >
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
    </motion.div>
  );
}

export default TaskCard;
