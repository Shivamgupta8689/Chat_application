import React, { useEffect, useState } from 'react'
import API from '../utils/axiosInstance'

const GetAllUser = () => {
    const [allUsers, setAllUser] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            setLoading(true)
            try {
                const response = await API.get("/api/user/getUserProfile");
                
                setAllUser(response.data.filteredUser)
                setLoading(false)
            } catch (error) {
                console.log("Error in GetAllUser", error)
                setLoading(false)
            }
        }
        getUser()
    }, [])

    return [allUsers, loading]
}

export default GetAllUser
