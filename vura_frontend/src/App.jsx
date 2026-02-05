import React, { useState, useEffect } from "react";
import Navbar from './components/navbar';
import DetailDrawer from "./components/DetailDrawer";
import StatCard from "./components/statcard";
import ProductTable from "./components/ProductTable";
import AddProductInline from "./components/AddProduct";
import Login from "./components/login";

// --- GLOBAL CONFIG ---
// When you deploy, you only change this one line!
const API_URL = "http://localhost:5000";

function App() {
  // --- 1. STATES ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // AI States
  const [isScanning, setIsScanning] = useState(false);
  const [globalInsight, setGlobalInsight] = useState("");
  
  const [user, setuser] = useState(() => {
    const savedUser = localStorage.getItem("vura_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setloading] = useState(!!user);
  const [showAuth, setShowAuth] = useState(false);

  // --- 2. BACKEND SYNC ---
  useEffect(() => {
    if (!user) {
      setloading(false);
      return;
    }

    const fetchInventory = async () => {
      setloading(true);
      try {
        // Updated to use API_URL
        const response = await fetch(`${API_URL}/api/products/${user._id}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setProducts([]); 
      } finally {
        setloading(false);
      }
    };

    fetchInventory();
  }, [user]);

  // --- 3. FILTER LOGIC ---
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((item) => {
    if (!item) return false;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (item.name?.toLowerCase().includes(searchLower) || 
       item.category?.toLowerCase().includes(searchLower));

    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(safeProducts.map(p => p.category))];

  // --- 4. CALCULATIONS ---
  const totalValue = safeProducts.reduce((acc, item) => 
    acc + (Number(item.price || 0) * Number(item.stock || 0)), 0
  );

  const totalPotentialProfit = safeProducts.reduce((acc, item) => {
    const profitPerUnit = Number(item.price || 0) - Number(item.cost || 0);
    return acc + (profitPerUnit * Number(item.stock || 0));
  }, 0);

  const lowStockAlerts = safeProducts.filter(item => item.stock < 10).length;

  // --- 5. AI SCAN HANDLER ---
  const handleGlobalScan = async () => {
    if (safeProducts.length === 0) return;
    setIsScanning(true);
    setGlobalInsight("");
    try {
      // Updated to use API_URL
      const response = await fetch(`${API_URL}/api/ai/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: safeProducts }),
      });
      const data = await response.json();
      setGlobalInsight(data.suggestion);
      
      setTimeout(() => setGlobalInsight(""), 10000);
    } catch (error) {
      console.error("AI Scan failed:", error);
    } finally {
      setIsScanning(false);
    }
  };

  // --- 6. CRUD HANDLERS ---
  const handledelete = async (e, id) => {
    e.stopPropagation();
    try {
      // Updated to use API_URL
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(prev => prev.filter(item => item._id !== id));
        if (selectedProducts?._id === id) setSelectedProducts(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const addProduct = async (newProduct) => {
    if (!user) return;
    const productWithUser = { ...newProduct, user: user._id, cost: newProduct.cost || 0 }; 
    try {
      // Updated to use API_URL
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithUser),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setProducts(prev => [savedProduct, ...prev]);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      // Updated to use API_URL
      const response = await fetch(`${API_URL}/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(prev => prev.map(p => p._id === data._id ? data : p));
        setSelectedProducts(data); 
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setuser(userData);
    localStorage.setItem("vura_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("vura_user");
    setuser(null);
    setProducts([]);
    setSelectedProducts(null);
    setGlobalInsight("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onLoginClick={() => setShowAuth(true)} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {showAuth && (
        <Login 
          onLogin={(userData) => {
            handleLoginSuccess(userData);   
            setShowAuth(false);   
          }} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      <div className="flex pt-20">
        <aside
          className={`fixed top-20 left-0 h-[calc(100vh-80px)] bg-white border-r border-slate-200/60 
          transition-all duration-300 ease-in-out z-40 overflow-hidden
          ${(isSidebarOpen && !selectedProducts) ? "w-64 p-6" : "w-0 p-0 border-none opacity-0"}`}
        >
          <nav className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Menu</h3>
            <button className="flex items-center gap-3 p-3 bg-cyan-50 text-cyan-600 rounded-xl font-bold text-sm text-left">
              Inventory
            </button>
          </nav>
        </aside>

        <main className={`flex-1 transition-all duration-300 ease-in-out px-8 py-12 ${(isSidebarOpen && !selectedProducts) ? "ml-64" : "ml-0"}`}>
          {!user ? (
            <div className="text-center p-20 animate-in fade-in duration-500">
               <h2 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Please Login to view Inventory</h2>
               <button onClick={() => setShowAuth(true)} className="mt-4 text-cyan-600 font-bold underline">Login Now</button>
            </div>
          ) : selectedProducts ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => setSelectedProducts(null)} className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold text-xs uppercase tracking-widest transition-all">
                <span className="text-lg transition-transform group-hover:-translate-x-1">←</span> Back to Inventory
              </button>
              <DetailDrawer product={selectedProducts} onUpdate={updateProduct} onClose={() => setSelectedProducts(null)} />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Vura Inventory</h1>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Real-time Asset Management</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleGlobalScan}
                    disabled={isScanning || safeProducts.length === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isScanning ? (
                      <span className="animate-pulse">Scanning...</span>
                    ) : (
                      <><span>✨</span> Scan Project</>
                    )}
                  </button>

                  <button 
                    onClick={() => setShowAddForm(!showAddForm)} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95
                      ${showAddForm ? "bg-slate-100 text-slate-500" : "bg-slate-900 text-white hover:bg-cyan-500 shadow-lg shadow-slate-200"}`}
                  >
                    <span className={`text-xl transition-transform ${showAddForm ? "rotate-45" : ""}`}>+</span>
                    {showAddForm ? "Cancel" : "Add Asset"}
                  </button>
                </div>
              </div>

              {globalInsight && (
                <div className="mb-8 p-5 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center gap-5 animate-in slide-in-from-top-4 duration-500 border border-slate-800">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-tr from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    🤖
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">Project Manager Insight</p>
                    <p className="text-sm font-medium leading-relaxed text-slate-200">{globalInsight}</p>
                  </div>
                  <button onClick={() => setGlobalInsight("")} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-slate-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Portfolio Value" value={`$${totalValue.toLocaleString()}`} color="blue" />
                <StatCard title="Potential Profit" value={`$${totalPotentialProfit.toLocaleString()}`} color="emerald" />
                <StatCard title="Low Stock" value={lowStockAlerts} color="orange" />
              </div>

              {showAddForm && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AddProductInline onAdd={addProduct} />
                </div>
              )}

              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                      ${activeCategory === cat ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white text-slate-400 border border-slate-100 hover:border-cyan-400 hover:text-cyan-500"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Syncing with Database...</div>
                ) : (
                  <ProductTable products={filteredProducts} onRowClick={(product) => setSelectedProducts(product)} onDelete={handledelete} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;