import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const item = localStorage.getItem("user");
            return item && item !== "undefined" ? JSON.parse(item) : null;
        } catch (error) {
            return null;
        }
    })

    const syncUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get('/users/me');
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch (err) {
                console.error("Auth sync failed", err);
            }
        }
    }, []);

    useEffect(() => {
        syncUser();
    }, [syncUser]);

    const login = (userData, token) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, syncUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
