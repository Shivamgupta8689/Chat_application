import React, { createContext, useContext, useState } from 'react'
import Cookies from "js-cookie"

export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
    const getInitialUser = () => {
        try {
            const userData = localStorage.getItem("messenger");
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Failed to parse user data:", error);
            localStorage.removeItem("messenger"); // Clean up invalid data
            return null;
        }
    };

    const [authUser, setAuthUser] = useState(getInitialUser());

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
