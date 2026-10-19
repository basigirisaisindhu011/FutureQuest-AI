import React, { useState, useEffect } from "react";
import api from "../utils/api";
export function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2>Admin Console</h2>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="card">
        <h3>Ecosystem Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} ({u.role}) - {u.accountStatus}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
