import React from "react";

const Navbar = ({ searchTerm, setSearchTerm, toggleSidebar, user, onLogout, onLoginClick }) => {
  console.log("Navbar User State:", user);
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-slate-100 z-50 h-20 flex items-center px-6">
      <div className="flex items-center gap-4 w-full">
        
        {/** toggle button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/** logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-200">
            <span className="text-white font-black text-sm">v</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">vura</span>
        </div>

        {/** search bar */}
        <div className="relative flex-1 max-w-md ml-4">
          <input
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          />
        </div>

        {/* Auth Button */}
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Session</p>
                <p className="text-sm font-black text-slate-900">{user.username}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-slate-100 text-slate-600 hover:text-red-500 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            // Show this when logged out
            <button
              onClick={onLoginClick}
              className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-cyan-400 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;