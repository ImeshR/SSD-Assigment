import User from "../../models/Users/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../../firebase.js";

const SALT_ROUNDS = 10;

export const register = async (req, res, next) => {
  try {
    const { username, email, password, type } = req.body;

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
      .json({ access_token: accessToken, refresh_token: refreshToken, user });
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        password: null,
        type: "Regular User",
        firebaseUid: uid,
        profilePicture: picture,
      });
      await user.save();
    } else {
      user.firebaseUid = uid;
      user.profilePicture = picture;
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({
      success: false,
      message: "Google login failed",
      error: err.message,
    });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.username,
      email: user.email,
      type: user.type,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}
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

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}
