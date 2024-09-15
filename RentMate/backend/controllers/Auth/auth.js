// controllers/Auth.js

import User from "../../models/Users/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10; // Reduced from 18 for better performance

export const register = async (req, res, next) => {
  try {
    const { username, email, password, type } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({ username, email, password: hash, type });
    await newUser.save();

    res.status(201).json({ message: "User has been created" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(400).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refresh_token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ access_token: newAccessToken });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.sendStatus(204);

    await User.findOneAndUpdate(
      { refreshToken: refresh_token },
      { refreshToken: null }
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}
