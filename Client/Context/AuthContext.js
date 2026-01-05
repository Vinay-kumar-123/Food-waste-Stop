"use client";
import { createContext , useContext , useState , useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const role = localStorage.getItem("role");
        if(role) setUser({role});
    }, []);
    const login = (token , role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setUser({role});
    };
    const logout = () => {
      localStorage.clear();
      setUser(null);
    };
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);