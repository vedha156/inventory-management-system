"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {

  const [data, setData] = useState<any>({});

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res =
          await api.get(
            "/dashboard",
            {
              headers: {
                Authorization:
                `Bearer ${token}`
              }
            }
          );

        setData(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchDashboard();

  }, []);

  return (
    <>
      <Sidebar />

      <div className="main">

        <h1>Dashboard</h1>

        <div className="dashboard-grid">

          <div className="card">
            <h3>Total Products</h3>
            <p>{data.totalProducts || 0}</p>
          </div>

          <div className="card">
            <h3>Total Orders</h3>
            <p>{data.totalOrders || 0}</p>
          </div>

          <div className="card">
            <h3>Revenue</h3>
            <p>₹{data.totalRevenue || 0}</p>
          </div>

          <div className="card">
            <h3>Low Stock</h3>
            <p>{data.lowStockProducts || 0}</p>
          </div>

        </div>

      </div>
    </>
  );

}