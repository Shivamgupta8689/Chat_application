import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance';

const GetAllUser = () => {
    const [allUsers, setAllUser] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const response = await API.get("/api/user/getUserProfile");
                
                setAllUser(response.data.filteredUser || []);
            } catch (error) {
                console.error("Error in GetAllUser:", error);
                
                // 401 error pe login redirect
                if (error.response?.status === 401) {
                    localStorage.removeItem("messenger");
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);
    
    return [allUsers, loading];
};

export default GetAllUser;
