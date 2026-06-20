"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/products/audit-logs", { headers: { Authorization: `Bearer ${token}` } });
        setLogs(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("ADD")) return "badge-success";
    if (action.includes("DELETE") || action.includes("REDUCE")) return "badge-danger";
    if (action.includes("UPDATE")) return "badge-warning";
    return "badge-info";
  };

  return (
    <AuthenticatedLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">System Audit Logs</h2>
        <p className="text-slate-400">Track all critical actions performed by users.</p>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No audit logs found.</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {logs.map((l: any) => (
              <div key={l.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={getActionColor(l.action)}>
                      {l.action}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Log ID: #{l.id} | User ID: {l.user_id}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{l.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}