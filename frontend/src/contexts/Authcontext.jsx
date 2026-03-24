
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
        const token = localStorage.getItem("token");
        if (token && !user) {
            syncUser();
        }
    }, [user, syncUser]);

    const signup = async (userData) => {
        try {
            const res = await axios.post('/auth/register', userData);
            return { success: true, data: res.data };
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            const { token, user: backendUser } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(backendUser));
            setUser(backendUser);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const loginWithToken = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // login alias removed to fix redeclaration error

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const enterGuest = () => {
        setUser({ role: 'guest', name: 'Guest', points: 0 });
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            signup, 
            loginWithToken,
            enterGuest, 
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
