"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login Success");

      router.push("/dashboard");

    } catch (error:any) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh",
        background:"#f4f6f9"
      }}
    >

      <div
        style={{
          background:"white",
          padding:"40px",
          borderRadius:"12px",
          width:"350px",
          boxShadow:"0 4px 20px rgba(0,0,0,0.1)"
        }}
      >

        <h2>Inventory Management</h2>

        <br/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width:"100%",
            padding:"10px"
          }}
        >
          Login
        </button>

      </div>

    </div>

  );

}