import React from "react";

const ProductTable = ({ products, onRowClick, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-slate-100">
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              onClick={() => onRowClick(product)}
              className="group cursor-pointer hover:bg-blue-50/30 transition-all duration-200 border-b border-slate-50 last:border-0"
            >
              <td className="p-6 font-bold text-slate-900">
                {product.name}
              </td>
              <td className="p-6">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.category}
                </span>
              </td>
              <td className="p-6 font-medium text-slate-700">${product.price}</td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                  <span className={`font-bold ${product.stock < 10 ? 'text-orange-600' : 'text-slate-700'}`}>
                    {product.stock}
                  </span>
                </div>
              </td>
              <td className="p-6 text-right">
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents opening the DetailDrawer
                      onDelete(e, product._id);
                    }}
                    className="text-red-400 hover:text-red-600 font-bold text-xs transition-colors"
                  >
                    Delete
                  </button>
                  <span className="text-blue-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details {'\u2192'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="p-20 text-center">
          <p className="text-slate-400 font-medium">No products found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;