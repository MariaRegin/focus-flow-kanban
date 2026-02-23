import type { Task, Status } from "../types/types";
import { Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}

function TaskCard({ task, index, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors mb-3" // layout
          // initial={{ opacity: 0, y: 10 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-3 gap-2">
              <span className="font-medium text-gray-200 leading-tight">
                {task.title}
              </span>
              <button
                className="shrink-0 text-gray-600 hover:text-red-500 hover:bg-red-900/20 p-1.5 rounded transition-all"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-700/50">
              {" "}
              <select
                className="bg-gray-900/50 text-[10px] text-gray-400 p-1 rounded border border-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                value={task.status}
                onChange={(e) =>
                  onStatusChange(task.id, e.target.value as Status)
                }
              >
                <option value="todo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
              <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
