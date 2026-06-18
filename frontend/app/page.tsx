import Link from "next/link";

export default function Home() {

  return (

    <div style={{ padding: "20px" }}>

      <h1>Inventory Management System</h1>

      <br />

      <Link href="/login">
        Login
      </Link>

      <br /><br />

      <Link href="/dashboard">
        Dashboard
      </Link>

      <br /><br />

      <Link href="/products">
        Products
      </Link>

      <br /><br />

      <Link href="/orders">
        Orders
      </Link>

      <br /><br />

      <Link href="/audit-logs">
        Audit Logs
      </Link>

    </div>

  );

}