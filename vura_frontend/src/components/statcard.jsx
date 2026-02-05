import React from 'react';

const StatCard = ({ title, value, trend, color }) => {
  // Mapping the 'color' prop to Tailwind classes
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-4">
        {/* Header: Title Badge */}
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colorStyles[color] || colorStyles.blue}`}>
            {title}
          </span>
        </div>

        {/* The Big Stat Number */}
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;