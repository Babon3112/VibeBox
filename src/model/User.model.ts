import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  //   avatar: {
  //     type: String,
  //     required: true,
  //   },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  mobileno: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isverified: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
