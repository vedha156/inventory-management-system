"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default function Dashboard() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    { 
      label: "Total Revenue", 
      value: `₹${data.totalRevenue?.toLocaleString() || 0}`,
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-500/10",
      textColor: "text-emerald-400"
    },
    { 
      label: "Total Products", 
      value: data.totalProducts || 0,
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      color: "from-indigo-500 to-blue-600",
      bgLight: "bg-indigo-500/10",
      textColor: "text-indigo-400"
    },
    { 
      label: "Total Orders", 
      value: data.totalOrders || 0,
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      color: "from-purple-500 to-fuchsia-600",
      bgLight: "bg-purple-500/10",
      textColor: "text-purple-400"
    },
    { 
      label: "Pending Orders", 
      value: data.pendingOrders || 0,
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-500/10",
      textColor: "text-amber-400"
    },
    { 
      label: "Low Stock Items", 
      value: data.lowStockProducts || 0,
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      color: "from-rose-500 to-red-600",
      bgLight: "bg-rose-500/10",
      textColor: "text-rose-400"
    }
  ];

  return (
    <AuthenticatedLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-400">Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse bg-slate-800/50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgLight}`}>
                  <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </AuthenticatedLayout>
  );
}