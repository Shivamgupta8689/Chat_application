import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import API from '../utils/axiosInstance'

const GetAllUser = () => {
    const [allUsers, setAllUser] = useState([])
    const [loading, setLoading] = useState([])
    useEffect(()=>{
        const getUser = async ()=>{
            setLoading(true);
            try {
                const token = Cookies.get("jwt")
                const response = await API.get("/api/user/getUserProfile", {
                    Credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                setAllUser(response.data.filteredUser)
                setLoading(false)
            } catch (error) {
                console.log("Error in GetAllUser" + error)
            }
        }
        getUser()
    }, [])
    return [allUsers , loading]
}

export default GetAllUser
