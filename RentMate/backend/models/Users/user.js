import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "Regular User",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);
export default User;
