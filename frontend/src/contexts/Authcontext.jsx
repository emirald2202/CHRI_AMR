import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "../api/axios"
import { supabase } from "../config/supabaseClient"

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
        // Listen for Supabase auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    try {
                        const pendingDataStr = localStorage.getItem("pending_signup_data");
                        const extraData = pendingDataStr ? JSON.parse(pendingDataStr) : {};

                        const res = await axios.post('/auth/supabase-login', extraData, {
                            headers: { Authorization: `Bearer ${session.access_token}` }
                        });
                        const { token: backendToken, user: backendUser } = res.data;
                        
                        // Clear pending data after successful sync
                        localStorage.removeItem("pending_signup_data");
                        
                        localStorage.setItem("token", backendToken);
                        localStorage.setItem("user", JSON.stringify(backendUser));
                        setUser(backendUser);
                    } catch (err) {
                        console.error("Auto-sync failed", err);
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        });

        const token = localStorage.getItem("token");
        if (token && !user) {
            syncUser();
        }

        return () => subscription.unsubscribe();
    }, [user, syncUser]);

    const sendOtp = async ({ email, phone }) => {
        try {
            const options = {
                ...(email && { email }),
                ...(phone && { phone }),
                options: { shouldCreateUser: true }
            };
            const { error } = await supabase.auth.signInWithOtp(options);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Send OTP error:", error);
            throw error;
        }
    };

    const verifyOtp = async ({ email, phone, token, extraData = {} }) => {
        try {
            const options = {
                ...(email && { email }),
                ...(phone && { phone }),
                token,
                type: email ? 'email' : 'sms'
            };
            const { data, error } = await supabase.auth.verifyOtp(options);
            if (error) throw error;

            const { session } = data;
            const accessToken = session.access_token;

            // Sync with backend using the Supabase JWT
            const res = await axios.post('/auth/supabase-login', extraData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const { token: backendToken, user: backendUser } = res.data;
            localStorage.setItem("token", backendToken);
            localStorage.setItem("user", JSON.stringify(backendUser));
            setUser(backendUser);

            return { success: true };
        } catch (error) {
            console.error("Verify OTP error:", error);
            throw error;
        }
    };

    const loginWithToken = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // login alias removed to fix redeclaration error

    const logout = async () => {
        await supabase.auth.signOut();
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
            logout, 
            sendOtp, 
            verifyOtp,
            loginWithToken,
            enterGuest, 
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
