import type { Task, Status } from "../types/types";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}

function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      {task.title}
      <select
        className="bg-gray-700 text-xs p-1 rounded ml-2 cursor-pointer"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
      >
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <button
        className="ml-4 text-red-500 hover:text-red-400 text-sm"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;
