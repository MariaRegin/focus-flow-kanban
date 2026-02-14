import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useTaskStore } from "./store/useTaskStore";
import type { Status } from "./types/types";

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const [inputValue, setInputValue] = useState("");

  async function handleCreate() {
    if (!inputValue.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title: inputValue, status: "todo" }])
      .select()
      .single();

    if (data) addTask(data);
    if (error) console.error("Error:", error.message);

    setInputValue("");
  }

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

      <div>
        <input
          className="rounded-lg bg-gray-800 border border-gray-700 p-2"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />
        <button className="bg-blue-600" onClick={handleCreate}>
          Add
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-400">Todo</h2>
          {tasks
            .filter((task) => task.status === "todo")
            .map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                {task.title}
                <select
                  className="bg-gray-700 text-xs p-1 rounded ml-2 cursor-pointer"
                  value={task.status}
                  onChange={(e) => {
                    handleStatusChange(task.id, e.target.value as Status);
                  }}
                >
                  <option value="todo">Todo</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
                <button
                  className="ml-4 text-red-500 hover:text-red-400 text-sm"
                  onClick={() => {
                    handleDelete(task.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-400">Doing</h2>
          {tasks
            .filter((task) => task.status === "doing")
            .map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                {task.title}
                <button
                  className="ml-4 text-red-500 hover:text-red-400 text-sm"
                  onClick={() => {
                    handleDelete(task.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-400">Done</h2>
          {tasks
            .filter((task) => task.status === "done")
            .map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                {task.title}
                <button
                  className="ml-4 text-red-500 hover:text-red-400 text-sm"
                  onClick={() => {
                    handleDelete(task.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
