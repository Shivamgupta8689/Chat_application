import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from "axios"
import { useAuth } from '../context/Authprovider'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../utils/axiosInstance'

const Signup = () => {
  const { authUser, setAuthUser } = useAuth()
  const [image, setImage] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");
  const confirmpassword = watch("confirmpassword", "");

  const validatePasswordMatch = (value) => {
    return value === password || "Password and confirm password don't match"
  }

  const onSubmit = async (data) => {

    // ⭐ FormData banate hain kyunki isme image bhejni hai
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmpassword", data.confirmpassword);
    formData.append("image", image); 

    await API.post("/api/user/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then((response) => {
        toast.success("Signup Successful! You can now login");
        localStorage.setItem("messenger", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      });
  }

  return (
    <>
      <form className="border-black " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center h-screen">
          <fieldset className="fieldset bg-base-200 border-black rounded-box w-[400px] border p-4">
            <h1 className="text-xl text-center w-[100%]">Sign Up</h1>

            <label className="label font-bold text-sm">Name</label>
            <input type="text" className="input input-bordered w-full"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            {errors.name && <span className='text-red-600'>**This field is required**</span>}

            <label className="label font-bold text-sm">Email</label>
            <input type="email" className="input input-bordered w-full"
              placeholder="Enter Email"
              {...register("email", { required: true })}
            />
            {errors.email && <span className='text-red-600'>**This field is required**</span>}

            <label className="label font-bold text-sm">Password</label>
            <input type="password" className="input input-bordered w-full"
              placeholder="Enter Password"
              {...register("password", { required: true })}
            />
            {errors.password && <span className='text-red-600'>**This field is required**</span>}

            <label className="label font-bold text-sm">Confirm Password</label>
            <input type="password" className="input input-bordered w-full"
              placeholder="Confirm Password"
              {...register("confirmpassword", {
                required: true,
                validate: validatePasswordMatch
              })}
            />
            {errors.confirmpassword && (
              <span className='text-red-600'>{errors.confirmpassword.message}</span>
            )}

            {/* ⭐ Image Upload Field */}
            <label className="label font-bold text-sm mt-2">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {/* Optional Preview */}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-20 h-20 mt-2 rounded-full object-cover"
              />
            )}

            <input type="submit" value="signup"
              className='text-white w-full rounded-lg py-2 btn btn-primary text-m mt-4' />

            <p className="text-center mt-3">
              Already have an account?
              <Link to={"/login"} className='text-blue-500 underline cursor-pointer ml-1 text-sm'>
                Login
              </Link>
            </p>
          </fieldset>
        </div>
      </form>
    </>
  )
}

export default Signup
