import { useState } from 'react'
import Left from './left/Left'
import Right from './right/Right'
import Logout from './left1/Logout'
import Signup from './components/Signup'
import Login from './components/Login'
import { useAuth } from './context/Authprovider'
import { Routes, Route, Navigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './components/ForgotPassword'

function App() {
  const {authUser, setAuthUser} = useAuth();

  return (
    <>
      <Routes>
      <Route
        path="/"
        element={
          authUser ? (
            <div className="flex h-screen">
              <Logout />
              <Left />
              <Right />
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
      <Route path="/forgotPassword" element={authUser ? <Navigate to="/" /> : <ForgotPassword/>} />
    </Routes>
    <Toaster />

    </>
    
  )
}

export default App
