import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useTaskStore } from "./store/useTaskStore";
import type { Status } from "./types/types";
import Column from "./components/Column";
import TaskInput from "./components/TaskInput";
import Auth from "./components/Auth";

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const user = useTaskStore((state) => state.user);
  const setUser = useTaskStore((state) => state.setUser);
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
      if (user === null) return;

      const { data, error } = await supabase.from("tasks").select("*");

      if (error) console.error("Error:", error.message);
      else if (data) {
        setTasks(data);
      }
    }
    fetchTasks();
  }, [setTasks, user]);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error("Error:", error.message);
      else if (session) {
        setUser(session.user);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setUser(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-5">Kanban</h1>

      <button>Logout</button>

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
