// routes/auth.routes.js

import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  get_me
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const authrouter = express.Router();

authrouter.post("/register", registerUser);
authrouter.post("/login", loginUser);
authrouter.get("/profile", verifyJWT, getProfile);
authrouter.get("/get-me", verifyJWT, get_me);
authrouter.post("/logout", verifyJWT, logoutUser);

export default authrouter;