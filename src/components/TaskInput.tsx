import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTaskStore } from "../store/useTaskStore";

function TaskInput() {
  const user = useTaskStore((state) => state.user);
  const addTask = useTaskStore((state) => state.addTask);

  const [inputValue, setInputValue] = useState("");

  async function handleCreate() {
    if (!user) return;

    if (!inputValue.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: user.id, title: inputValue, status: "todo" }])
      .select()
      .single();

    if (data) addTask(data);
    if (error) console.error("Error:", error.message);

    setInputValue("");
  }

  return (
    <div className="mb-6 flex gap-2">
      <input
        className="rounded-lg bg-gray-800 border border-gray-700 p-2 text-white outline-none focus:border-blue-500"
        type="text"
        placeholder="New task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
        }}
      />
      <button
        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 font-bold"
        onClick={handleCreate}
      >
        Add
      </button>
    </div>
  );
}

export default TaskInput;
