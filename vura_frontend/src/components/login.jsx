import React, { useState } from "react";

const Login = ({ onLogin, onClose }) => {
const [isRegister, setIsRegister] = useState(false); // Toggle state
const [formData, setFormData] = useState({ username: "", password: "" });
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

// Determine which API route to hit
const endpoint = isRegister ? "register" : "login";
// Add this at the top of the file (outside the component)
const API_URL =process.env.REACT_APP_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${API_URL}/api/authentication/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          // If they just registered, automatically switch to login mode
          alert("Registration successful! Please login.");
          setIsRegister(false);
        } else {
          // If logging in, pass user data up to App.js
          onLogin(data.user);
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {isRegister ? "Create Account" : "Secure Login"}
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              {isRegister ? "Join the Vura network" : "Access your inventory"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-cyan-500 shadow-lg shadow-slate-200 transition-all active:scale-[0.98] uppercase tracking-widest text-xs mt-4"
          >
            {isRegister ? "Register Now" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-xs font-medium">
            {isRegister ? "Already have an account?" : "Don't have an account yet?"}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-cyan-600 font-bold hover:underline"
            >
              {isRegister ? "Login here" : "Sign up for free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;