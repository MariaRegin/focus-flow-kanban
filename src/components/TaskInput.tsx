import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTaskStore } from "../store/useTaskStore";

function TaskInput() {
  const user = useTaskStore((state) => state.user);
  const addTask = useTaskStore((state) => state.addTask);

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  async function handleCreate() {
    setError("");

    if (!user) {
      showError("You must be logged in");
      return;
    }

    if (!inputValue.trim()) {
      showError("Task title cannot be empty");
      return;
    }

    const { data, error: dbError } = await supabase
      .from("tasks")
      .insert([{ user_id: user.id, title: inputValue, status: "todo" }])
      .select()
      .single();

    if (dbError) {
      showError(dbError.message);
    } else if (data) {
      addTask(data);
      setInputValue("");
    }
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          className="rounded-lg bg-gray-800 border border-gray-700 p-2 text-white outline-none focus:border-blue-500"
          type="text"
          placeholder="New task..."
          value={inputValue}
          aria-label="New task name"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer font-bold"
          type="button"
          onClick={handleCreate}
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default TaskInput;
