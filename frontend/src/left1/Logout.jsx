import React, { useState } from 'react'
import {TbLogout2} from 'react-icons/tb'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import API from '../utils/axiosInstance';
const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleLogout = async ()=>{
    setLoading(true)
    try {
      await API.post("/api/user/logout");
      localStorage.removeItem("messenger")
      Cookies.remove("jwt")
      setLoading(false)
      toast.success("LogOut Successfully")
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
        <div className=' w-[4%] bg-slate-950 text-white flex flex-col justify-end'>
        <div className=' p-3 align-bottom'>
            <button onClick={handleLogout}>
                <TbLogout2 className=' text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300'/>
            </button>
        </div>
        </div>
    </>
  )
}

export default Logout
