import React from 'react'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/Authprovider'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../utils/axiosInstance'

const Login = () => {
  const {authUser, setAuthUser} = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    try {
      const { data: response } = await API.post("/api/user/login", userInfo);
      if (response?.user) {
        toast.success("Login Successful!");
        localStorage.setItem("messenger", JSON.stringify(response.user));
        setAuthUser(response.user);
      } else {
        toast.error("Invalid login response");
      }
    } catch (error) {
      if(error.response){
        toast.error("Error:" + error.response.data.message)
      } else {
        toast.error("Unable to login. Please try again.");
      }
    }
  }
  return (
    <div>
      <form action="" className="border-black " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center h-screen">
          <fieldset className="fieldset bg-base-200 border-black rounded-box w-[400px] border p-4">
            <h1 className="text-xl text-center w-[100%]">Login</h1>


            <label className="label">Email</label>
            <input type="email" className="input input-bordered w-full" placeholder="Enter Email" {...register("email", { required: true })} />
            {errors.email && <span className=' text-red-600'>**This field is required**</span>}

            <label className="label">Password</label>
            <input type="password" className="input input-bordered w-full" placeholder="Enter Password" {...register("password", { required: true })} />
            {errors.password && <span className=' text-red-600'>**This field is required**</span>}

            <input type="submit" value="Login" className='text-white w-full rounded-lg py-2 btn btn-primary text-m' />

            <p className="text-center mt-3">
  Don't have an account?{" "}

  <Link
    to="/signup"
    className="text-blue-500 underline cursor-pointer ml-1 text-sm"
  >
    signup
  </Link>
  <Link
    to="/forgotPassword"
    className="text-blue-500 underline cursor-pointer ml-3 text-sm" // ⬅️ bigger gap
  >
    forgot password
  </Link>
  
</p>

          </fieldset>
        </div>
      </form>
    </div>
  )
}

export default Login
