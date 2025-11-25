import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../utils/axiosInstance"

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // STEP 1 → SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await API.post("/api/user/forgot-password", { email });

      if (res.data) {
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter valid 6-digit OTP");
    }

    setLoading(true);
    try {
      const res = await API.post("/api/user/verify-otp", {
        email,
        otp,
      });

      if (res.data) {
        toast.success(res.data.message || "OTP Verified!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 → RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      return toast.error("Fill all fields");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await API.post("/api/user/reset-password", {
        email,
        newPassword,
      });

      if (res.data) {
        toast.success(res.data.message || "Password reset successful!");
        // Reset form
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setStep(1);
        // window.location.href = "/login"; // Redirect to login
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form className="w-[380px] bg-white p-6 shadow-xl rounded-lg border">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* -------------------- STEP 1: EMAIL -------------------- */}
        {step === 1 && (
          <>
            <label className="label font-semibold">Registered Email</label>
            <input
              type="email"
              className="input input-bordered w-full mb-3"
              placeholder="your-email@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
            />

            <button
              className="btn btn-primary w-full mt-2 text-white"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* -------------------- STEP 2: OTP -------------------- */}
        {step === 2 && (
          <>
            <label className="label font-semibold">Enter OTP</label>
            <input
              type="text"
              maxLength="6"
              className="input input-bordered w-full mb-3"
              placeholder="6-digit OTP"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
              value={otp}
              disabled={loading}
            />

            <button
              className="btn btn-primary w-full mt-2 text-white"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p
              className="text-blue-600 underline mt-2 cursor-pointer text-center"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
            >
              Change Email
            </p>
          </>
        )}

        {/* -------------------- STEP 3: RESET PASSWORD -------------------- */}
        {step === 3 && (
          <>
            <label className="label font-semibold">New Password</label>
            <input
              type="password"
              className="input input-bordered w-full mb-3"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              disabled={loading}
            />

            <label className="label font-semibold">Confirm New Password</label>
            <input
              type="password"
              className="input input-bordered w-full mb-3"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
              disabled={loading}
            />

            <button
              className="btn btn-primary w-full mt-2 text-white"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;