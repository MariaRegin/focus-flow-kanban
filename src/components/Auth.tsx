import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email and password");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password) return alert("Enter email and password");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for confirmation!");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Kanban Board</h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Email</label>
          <input
            className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 outline-none focus:border-blue-500 transition-colors"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Password</label>
          <input
            className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 outline-none focus:border-blue-500 transition-colors"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button
            className="w-full bg-blue-600 py-2.5 rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-[0.98]"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <button
            className="w-full bg-transparent border border-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-all"
            disabled={loading}
            onClick={handleSignUp}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
