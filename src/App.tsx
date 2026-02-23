import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useTaskStore } from "./store/useTaskStore";
import type { Status } from "./types/types";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import Column from "./components/Column";
import TaskInput from "./components/TaskInput";
import Auth from "./components/Auth";

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const user = useTaskStore((state) => state.user);
  const isLoading = useTaskStore((state) => state.isLoading);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setUser = useTaskStore((state) => state.setUser);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const setIsLoading = useTaskStore((state) => state.setIsLoading);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === result.source.droppableId) return;

    const newStatus = destination.droppableId as Status;
    handleStatusChange(draggableId, newStatus);
  };

  async function handleDelete(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (!error) {
      deleteTask(id);
    } else {
      console.error("Error:", error.message);
    }
  }

  async function handleStatusChange(id: string, newStatus: Status) {
    updateTaskStatus(id, newStatus);

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error:", error.message);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) console.error("Error:", error.message);
  }

  useEffect(() => {
    async function fetchTasks() {
      if (user === null) return;

      setIsLoading(true);

      const { data, error } = await supabase.from("tasks").select("*");

      if (error) {
        setIsLoading(false);
        console.error("Error:", error.message);
      } else if (data) {
        setIsLoading(false);
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
      if (!session) setTasks([]);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return <Auth />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 font-medium animate-pulse">
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Kanban
          </h1>
          <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-full border border-blue-500/20 uppercase font-bold">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-500 border border-gray-700 hover:border-red-900/50 transition-all text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      <TaskInput />

      <DragDropContext onDragEnd={onDragEnd}>
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
      </DragDropContext>
    </div>
  );
}

export default App;
