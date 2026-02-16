import TaskCard from "./TaskCard";
import type { Task, Status } from "../types/types";

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
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-gray-400">{title}</h2>
      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
    </div>
  );
}

export default Column;
