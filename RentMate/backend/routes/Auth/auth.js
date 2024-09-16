// routes/Auth/auth.js

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
router.post("/google-login", googleLogin);
router.get("/logout", logout);

export default router;
