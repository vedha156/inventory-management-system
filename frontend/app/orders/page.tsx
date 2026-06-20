"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this order? Stock will be restored.")) return;
    const token = localStorage.getItem("token");
    try {
      await api.post(`/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "badge-success";
      case "Pending": return "badge-warning";
      case "Cancelled": return "badge-danger";
      default: return "badge-info";
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Management</h2>
          <p className="text-slate-400">View and manage customer orders.</p>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              {role === "admin" && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">No orders found.</td>
              </tr>
            ) : (
              orders.map((o: any) => (
                <tr key={o.id}>
                  <td>
                    <span className="font-mono text-indigo-400 font-medium">#{o.id.toString().padStart(6, '0')}</span>
                  </td>
                  <td className="text-slate-300">User {o.user_id}</td>
                  <td className="font-medium text-white">₹{o.total_amount}</td>
                  <td>
                    <span className={getStatusBadge(o.status)}>
                      {o.status}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td className="text-right">
                      {o.status !== "Cancelled" && (
                        <div className="flex justify-end gap-2 items-center">
                          <select 
                            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-md px-2 py-1 outline-none"
                            value={o.status}
                            onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button onClick={() => handleCancelOrder(o.id)} className="p-1 text-rose-400 hover:bg-rose-400/10 rounded transition-colors" title="Cancel Order">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}