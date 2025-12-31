"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const psid = localStorage.getItem('psid');
        const userData = localStorage.getItem('user_data');
        if (psid && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (psid) => {
        try {
            const response = await fetch(`/api/students/${psid}/profile.json`);
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('psid', psid);
                localStorage.setItem('user_data', JSON.stringify(data));
                setUser(data);
                router.push('/dashboard');
                return { success: true };
            } else {
                return { success: false, error: "Invalid PSID or data not found." };
            }
        } catch (err) {
            return { success: false, error: "Authentication failed. Please check your connection." };
        }
    };

    const logout = () => {
        localStorage.removeItem('psid');
        localStorage.removeItem('user_data');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
