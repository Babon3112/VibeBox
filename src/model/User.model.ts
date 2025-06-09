import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    avatar: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    mobileno: {
      type: String,
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
    password: { type: String, required: true, minlength: 6 },
    isverified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
  },
  { timestamps: true }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
