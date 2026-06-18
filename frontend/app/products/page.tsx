"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/products",
        {
          headers:{
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setProducts(res.data);

    };

    fetchProducts();

  }, []);

  return (

    <div style={{padding:"20px"}}>

      <h1>Products</h1>

      <table border={1}>

        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p:any)=>(

            <tr key={p.id}>

              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.stock_quantity}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}