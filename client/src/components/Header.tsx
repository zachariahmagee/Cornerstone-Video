import { useEffect, useState } from "react";
import { API_BASE } from "../utils/config";
import { useUser } from "../hooks/UserContext";
import type User from "../types/User";

const api_base = `${API_BASE}/users`

export default function Header() {
  const [newUserName, setNewUserName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  const { user, setUser } = useUser();

  const handleRegister = async () => {
    if (!email || !newUserName) {
        setStatus("Please enter a name and email.");
        return;
    }

    try {
        const res = await fetch(api_base, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newUserName, email }),
        });

        if (!res.ok) {
            const err = await res.json();
            setStatus(err?.error || "Registration failed");
            return;
        }

        const user: User = await res.json();
 
        setUser(user)
        setStatus("");
        setNewUserName("");
        setEmail("");

    } catch (err) {
      console.error(err);
      setStatus("Error registering user.");
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#1a1a1a",
        color: "#fff",
      }}
    >
      <img
        src="/cs-video-logo16x9.png"
        alt="Cornerstone Video Logo"
        style={{
          maxWidth: "300px",
          height: "auto",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input
            type="text"
            value={newUserName}
            placeholder="User Name"
            onChange={(e) => setNewUserName(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #444" }}
          />
          <input
            type="email"
            value={email}
            placeholder="User Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #444" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
          <button
            onClick={handleRegister}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #444",
              cursor: "pointer",
            }}
          >
            Log In
          </button>
          {user && (
            <span style={{ fontSize: "0.9rem", color: "#bbb" }}>
              Logged in as: <strong>{user.name}</strong>
            </span>
          )}
          {status && <span style={{ color: "red", fontSize: "0.85rem" }}>{status}</span>}
        </div>
      </div>
    </header>
  );
}

// export default function Header() {
//     return (
//         <header style={{ display: "flex", flexDirection: "row" }}>
//         <img
//             src="/cs-video-logo16x9.png"
//             alt="Cornerstone Video Logo"
//             style={{
//                 maxWidth: '350px',
//                 height: 'auto',
//                 display: 'block',
//                 margin: '0 auto'
//             }}
//         /> 
//         </header>
//     )
// }