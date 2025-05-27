import { useState } from "react";
import { API_BASE } from "../utils/config";
import { useUser } from "../hooks/UserContext";
import type User from "../types/User";
import { registerUser } from "../api/users";

const api_base = `${API_BASE}/users`;


export default function UserRegistration() {
    const [newUserName, setNewUserName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<string>("");

    const { user, setUser } = useUser();

    const handleRegister = async () => {
        if (!email || !newUserName) {
            setStatus("Please enter a name and email.");
            return;
        }

        const result = await registerUser(newUserName, email);

        if (!result.success) {
          setStatus(`Registration Failed: ${result.error}`);
          console.error("Registration Failed: ",result.error)
        } else {
          setUser(result.user)
          setStatus("");
          setNewUserName("");
          setEmail("");
        }
    }

    return (
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
            style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #444" }}
          />
          <input
            type="email"
            value={email}
            placeholder="User Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #444" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
          <button onClick={handleRegister}>Log In</button>
          {user && (
            <span style={{ fontSize: "0.9rem", color: "#bbb" }}>
              Logged in as: <strong>{user.name}</strong>
            </span>
          )}
          {status && <span style={{ color: "red", fontSize: "0.85rem" }}>{status}</span>}
        </div>
      </div>
    )
}