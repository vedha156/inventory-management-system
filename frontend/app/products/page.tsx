"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [stockAction, setStockAction] = useState<"ADD" | "REDUCE">("ADD");

  // Form states
  const [formData, setFormData] = useState({
    name: "", sku: "", category: "", price: "", stock_quantity: "", low_stock_limit: "", status: "Active"
  });
  const [stockQuantity, setStockQuantity] = useState("");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchProducts();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (currentProduct) {
        await api.put(`/products/${currentProduct.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post("/products", formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (error) {
      alert("Failed to save product. Ensure you have admin rights.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const endpoint = stockAction === "ADD" ? "/stock/add" : "/stock/reduce";
      await api.post(endpoint, {
        product_id: currentProduct.id,
        quantity: parseInt(stockQuantity)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setShowStockModal(false);
      setStockQuantity("");
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update stock.");
    }
  };

  const openProductModal = (product: any = null) => {
    setCurrentProduct(product);
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({ name: "", sku: "", category: "", price: "", stock_quantity: "", low_stock_limit: "10", status: "Active" });
    }
    setShowProductModal(true);
  };

  const openStockModal = (product: any, action: "ADD" | "REDUCE") => {
    setCurrentProduct(product);
    setStockAction(action);
    setStockQuantity("");
    setShowStockModal(true);
  };

  return (
    <AuthenticatedLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Catalog</h2>
          <p className="text-slate-400">Manage your inventory products and stock levels.</p>
        </div>
        {role === "admin" && (
          <button onClick={() => openProductModal()} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              {role === "admin" && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">No products found.</td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-1">SKU: {p.sku}</div>
                  </td>
                  <td>
                    <span className="px-2.5 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="text-white">₹{p.price}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${p.stock_quantity <= p.low_stock_limit ? 'text-rose-400' : 'text-white'}`}>
                        {p.stock_quantity}
                      </span>
                      {p.stock_quantity <= p.low_stock_limit && (
                        <span className="badge-danger">Low Stock</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={p.status === 'Active' ? 'badge-success' : 'badge-warning'}>
                      {p.status}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openStockModal(p, "ADD")} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Add Stock">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </button>
                        <button onClick={() => openStockModal(p, "REDUCE")} className="p-1.5 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Reduce Stock">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                        </button>
                        <button onClick={() => openProductModal(p)} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl p-6 relative">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-6">{currentProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">SKU</label>
                <input required className="input-field" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">Category</label>
                <input required className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">Price (₹)</label>
                <input type="number" step="0.01" required className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">Stock Quantity</label>
                <input type="number" required className="input-field" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-slate-300 mb-1">Low Stock Limit</label>
                <input type="number" required className="input-field" value={formData.low_stock_limit} onChange={e => setFormData({...formData, low_stock_limit: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-300 mb-1">Status</label>
                <select className="input-field bg-slate-800" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm p-6 relative">
            <button onClick={() => setShowStockModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-2">{stockAction === "ADD" ? "Add Stock" : "Reduce Stock"}</h3>
            <p className="text-sm text-slate-400 mb-6">Product: {currentProduct?.name}</p>
            <form onSubmit={handleStockSubmit}>
              <div className="mb-6">
                <label className="block text-sm text-slate-300 mb-1">Quantity to {stockAction}</label>
                <input type="number" min="1" required className="input-field text-xl text-center py-4" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} autoFocus />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowStockModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className={`btn-primary ${stockAction === 'REDUCE' ? '!bg-rose-600 hover:!bg-rose-700' : ''}`}>
                  Confirm {stockAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}