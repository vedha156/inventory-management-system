import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Inventory System</h2>

      <Link href="/dashboard">Dashboard</Link>

      <Link href="/products">Products</Link>

      <Link href="/orders">Orders</Link>

      <Link href="/audit-logs">Audit Logs</Link>

    </div>
  );
}