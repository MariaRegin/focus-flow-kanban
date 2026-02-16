import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useTaskStore } from "./store/useTaskStore";
import type { Status } from "./types/types";
import Column from "./components/Column";
import TaskInput from "./components/TaskInput";

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  async function handleDelete(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (!error) {
      deleteTask(id);
    } else {
      console.error("Error:", error.message);
    }
  }

  async function handleStatusChange(id: string, newStatus: Status) {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      updateTaskStatus(id, newStatus);
    } else {
      console.error("Error:", error.message);
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase.from("tasks").select("*");

      if (error) console.error("Error:", error.message);
      else if (data) {
        setTasks(data);
      }
    }
    fetchTasks();
  }, [setTasks]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-5">Kanban</h1>

      <TaskInput />

      <div className="grid grid-cols-3 gap-6">
        <Column
          title="Todo"
          status="todo"
          tasks={tasks}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
        <Column
          title="Doing"
          status="doing"
          tasks={tasks}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}

export default App;
