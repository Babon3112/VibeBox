"use client";
import Link from "next/link";
import { useState } from "react";

const SignupPage = () => {
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setAvatar(file);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#F9FAFB] p-6">
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border rounded-3xl bg-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 tracking-wide">
          Create Your Account
        </h1>
        <form className="flex flex-col items-center space-y-4 w-full">
          <label
            htmlFor="avatar"
            className="cursor-pointer relative rounded-full overflow-hidden w-28 h-28 shadow-xl border-2 border-blue-500 hover:border-pink-500 transition-colors"
          >
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
              }
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-50 flex justify-center items-center text-white text-sm font-semibold transition-opacity rounded-full select-none">
              Change
            </div>
          </label>
          <small id="avatarHelp" className="mb-2 text-gray-500 text-xs">
            Click on the circle to upload an avatar
          </small>

          <input
            type="text"
            name="name"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Full Name"
          />
          <input
            type="text"
            name="username"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Username"
          />
          <input
            type="number"
            name="mobile"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Mobile Number"
          />
          <input
            type="email"
            name="email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Email Address"
          />
          <input
            type="password"
            name="password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Confirm Password"
          />
          <span className="text-sm text-gray-600 text-center">
            By creating an account, I consent to the processing of your personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </span>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 rounded-xl w-full hover:bg-pink-500 transition focus:outline-none focus:ring-4 focus:ring-pink-500/50"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-blue-500 hover:text-pink-500 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
