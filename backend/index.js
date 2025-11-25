import express from "express";
import dotenv from "dotenv";
import ToConnect from "./config/db.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, io, server } from "./socketIO/server.js";

dotenv.config();

// Connect DB
ToConnect();


app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});
