import express from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  googleLogin,
} from "../../controllers/Auth/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/google-login", googleLogin); // POST request for Google login
router.post("/logout", logout); // Updated logout to POST for proper token handling

export default router;
