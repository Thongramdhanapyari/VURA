import React, { useState, useEffect } from "react";

const DetailDrawer = ({ product, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!product) return null;

  // Financial calculations based on LIVE formData
  const currentPrice = Number(formData.price || 0);
  const currentCost = Number(formData.cost || 0);
  const currentStock = Number(formData.stock || 0);
  
  const profit = currentPrice - currentCost;
  const margin = currentPrice > 0 ? ((profit / currentPrice) * 100).toFixed(1) : 0;

  // Chart Logic: Stock Capacity (SVG Pie)
  const maxCapacity = 100; 
  const stockPercentage = Math.min((currentStock / maxCapacity) * 100, 100);
  const strokeDashoffset = 100 - stockPercentage;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Page Title Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          {formData.name || product.name}
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
          Asset ID: {product._id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Major Details & Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SVG Pie Chart & Margin Bar Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock Capacity Pie Chart */}
            <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-cyan-500 transition-all duration-700 ease-in-out"
                    strokeWidth="4"
                    strokeDasharray="100 100"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-slate-700">{Math.round(stockPercentage)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</p>
                <p className="text-lg font-bold text-slate-700">{currentStock} Units</p>
              </div>
            </div>

            {/* Live Margin Progress Bar */}
            <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margin Analysis</p>
                <p className={`text-lg font-black ${margin < 20 ? 'text-orange-500' : 'text-emerald-500'}`}>{margin}%</p>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${margin < 20 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-4xl border border-slate-200/60 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
              General Information
            </h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Product Name</label>
                <input 
                  name="name" 
                  value={formData.name || ""} 
                  onChange={handleChange}
                  className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
                <input 
                  name="category" 
                  value={formData.category || ""} 
                  onChange={handleChange}
                  className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Current Stock</label>
                <input 
                  name="stock" 
                  type="number"
                  value={formData.stock || 0} 
                  onChange={handleChange}
                  className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Financial Actions */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-8 rounded-4xl text-white shadow-2xl shadow-slate-300">
            <h3 className="text-lg font-bold mb-8">Financials</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Cost per Unit</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-4 text-slate-500 font-bold">$</span>
                  <input 
                    name="cost" type="number"
                    value={formData.cost || 0} onChange={handleChange}
                    className="w-full p-4 pl-8 bg-slate-900/50 rounded-2xl border-none text-white font-bold focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Selling Price</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-4 text-slate-500 font-bold">$</span>
                  <input 
                    name="price" type="number"
                    value={formData.price || 0} onChange={handleChange}
                    className="w-full p-4 pl-8 bg-slate-900/50 rounded-2xl border-none text-white font-bold focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700 mt-6">
                <button 
                  onClick={() => onUpdate({
                    ...formData,
                    cost: Number(formData.cost),
                    price: Number(formData.price),
                    stock: Number(formData.stock)
                  })}
                  className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
                >
                  Update Records
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Status</span>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
              currentStock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {currentStock < 10 ? 'Low Stock' : 'Optimal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;