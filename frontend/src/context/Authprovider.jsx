import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
    const getInitialUser = () => {
        try {
            const storedUser = localStorage.getItem("messenger");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user:", error);
            localStorage.removeItem("messenger");
            return null;
        }
    };

    const [authUser, setAuthUser] = useState(getInitialUser());

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
