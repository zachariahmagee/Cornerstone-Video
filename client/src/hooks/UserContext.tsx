import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/User";
import { API_BASE } from "../utils/config";
import { registerUser } from "../api/users";


const api_base = `${API_BASE}/users`;

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  console.log({user});
  // Restore user on page reload:
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else {
      const registerGuest = async () => {
        const result = await registerUser("Guest", "guest@cs-video.local");
        if (result.success) {
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
        } else {
          console.error("Failed to register guest user: ", result.error);
        }
      };
      registerGuest()
    }
  }, []);
  
  // Persist user any time the user changes:
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}