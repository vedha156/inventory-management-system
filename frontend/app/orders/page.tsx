"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Orders(){

  const [orders,setOrders]=
  useState([]);

  useEffect(()=>{

    const fetchOrders =
    async ()=>{

      const token =
      localStorage.getItem("token");

      const res =
      await api.get(
        "/orders",
        {
          headers:{
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    };

    fetchOrders();

  },[]);

  return(

    <div style={{padding:"20px"}}>

      <h1>Orders</h1>

      <table border={1}>

        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((o:any)=>(

            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.total_amount}</td>
              <td>{o.status}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}