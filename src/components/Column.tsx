import TaskCard from "./TaskCard";
import type { Task, Status } from "../types/types";
import { AnimatePresence } from "framer-motion";

interface ColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}

function Column({
  title,
  status,
  tasks,
  onDelete,
  onStatusChange,
}: ColumnProps) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-gray-400">
        {title} <span className="text-gray-600 ml-2">{columnTasks.length}</span>
      </h2>
      <AnimatePresence>
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Column;
