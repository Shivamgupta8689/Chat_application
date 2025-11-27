import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { sendEmail } from "../utils/sendEmail.js";
import { createTokenSaveCookie } from "../jwt/generatedToken.js";
import cloudinary from "../config/cloudinary.js";


export const userSignup = async (req,res)=>{
    try {
        const {name,email,password,confirmpassword} = req.body;
        
        if(password !== confirmpassword){
            return res.status(400).json({ message: "Password do not match"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({ message: "User already exists" });
        }

        let profilePicUrl = "https://img.daisyui.com/images/profile/demo/gordon@192.webp";

    
        if (req.file) {
            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "users"
            });
            profilePicUrl = uploaded.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic: profilePicUrl
        });

        await newUser.save();

        createTokenSaveCookie(newUser._id, res);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

export const userLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(404).json({message: "User not found"})
        }
        createTokenSaveCookie(user._id,res);
        return res.status(201).json({
            message: "User Logged in Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        return res.status(500).json({message: "Server error"})
    }
}

export const userLogout = async (req,res) =>{
    try{
        res.clearCookie('jwt');
        return res.status(200).json({message:"user Logout Successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}

export const getUserProfile = async (req,res)=>{
    try {
        const loggedInUser = req.user._id;
        if (!loggedInUser) {
            return res.status(401).json({ message: "Unauthorized - no user found" });
        }
        const filteredUser = await User.find({ _id: { $ne: loggedInUser}}).select("-password");
        return res.status(201).json({ filteredUser })
    } catch (error) {
        console.log("Error in allUser Controller: " + error);
        return res.status(500).json({ message: "server error" })
    }
}

export const forgotPassword = async (req,res)=>{
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.resetOtp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    await user.save();
    
  
    await sendEmail(email, `Your OTP is ${otp}`);
  
    return res.json({ message: "OTP sent to email!" });
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Expiry check
        if (!user.otpExpiry || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Convert both to number for comparison
        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear OTP after success
        user.resetOtp = null;
        user.otpExpiry = null;
        await user.save();

        return res.json({ message: "OTP verified successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};



export const resetPassword = async (req,res)=>{
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successfully" });
}
