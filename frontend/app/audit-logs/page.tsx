"use client";

import { useEffect,useState }
from "react";

import api
from "../../services/api";

export default function AuditLogs(){

  const [logs,setLogs]=
  useState([]);

  useEffect(()=>{

    const fetchLogs =
    async ()=>{

      const token =
      localStorage.getItem("token");

      const res =
      await api.get(
        "/products/audit-logs",
        {
          headers:{
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setLogs(res.data);

    };

    fetchLogs();

  },[]);

  return(

    <div style={{padding:"20px"}}>

      <h1>Audit Logs</h1>

      <table border={1}>

        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>

          {logs.map((l:any)=>(

            <tr key={l.id}>
              <td>{l.action}</td>
              <td>{l.description}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}