import React, { useState } from "react";

const AddProductInline = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost: "",
    price: "",
    stock: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.cost || !formData.price || !formData.stock) {
      alert("Please fill in the required fields");
      return;
    }

    // New product object 
    const newProduct = {
      name: formData.name,
      category: formData.category || "uncategorized",
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) < 10 ? "low stock" : "available",
    };

    onAdd(newProduct);

    // Reset form
    setFormData({ name: "", category: "", cost: "", price: "", stock: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-xl flex flex-wrap md:flex-nowrap items-center gap-4 animate-in slide-in-from-top-2"
    >
      <div className="flex-1 min-w-50">
        <input
          type="text"
          placeholder="Product name"
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <select
        className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-500 focus:ring-2 focus:ring-blue-500"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Categories</option>
        <option value="electronics">Electronics</option>
        <option value="audio">Audio</option>
        <option value="accessories">Accessories</option>
      </select>

      <div className="w-24">
        <input
          type="number"
          placeholder="Cost"
          className="w-full bg-emerald-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
        />
      </div>

      <div className="w-24">
        <input
          type="number"
          placeholder="Price"
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </div>

      <div className="w-24">
        <input
          type="number"
          placeholder="Stock"
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
      >
        Save
      </button>
    </form>
  );
};

export default AddProductInline;