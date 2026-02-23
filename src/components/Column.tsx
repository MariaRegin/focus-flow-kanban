import TaskCard from "./TaskCard";
import type { Task, Status } from "../types/types";
import { Droppable } from "@hello-pangea/dnd";

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
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${status === "todo" ? "bg-gray-500" : status === "doing" ? "bg-blue-500" : "bg-emerald-500"}`}
          />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </h2>
        </div>
        <span className="text-xs font-bold bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 border border-gray-700">
          {columnTasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-screen"
          >
            {columnTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
