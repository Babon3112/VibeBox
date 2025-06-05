"use client";
import { signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SignupPage = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      username: "",
      mobileno: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const signup = async (data: z.infer<typeof signupSchema>) => {
    if (!avatar) {
      alert("Avatar is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("fullname", data.fullname);
      formData.append("username", data.username.toLowerCase());
      formData.append("mobileno", data.mobileno);
      formData.append("email", data.email.toLowerCase());
      formData.append("password", data.password);

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const verifyUrl = `${baseUrl}/verify/${data.username}`;
      formData.append("verifyUrl", verifyUrl);

      const response = await axios.post("/api/users/signup", formData);
      if (response.status === 201) {
        router.replace(`/verify/${data.username}`);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#F9FAFB] p-6">
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border rounded-3xl bg-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 tracking-wide">
          Create Your Account
        </h1>
        <form
          className="flex flex-col items-center space-y-4 w-full"
          onSubmit={handleSubmit(signup)}
        >
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
          <small className="text-gray-500 text-xs -mt-2">
            Click the circle to upload an avatar
          </small>

          <input
            {...register("fullname")}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Full Name"
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs">{errors.fullname.message}</p>
          )}

          <input
            {...register("username")}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username.message}</p>
          )}

          <input
            {...register("mobileno")}
            type="number"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Mobile Number"
          />
          {errors.mobileno && (
            <p className="text-red-500 text-xs">{errors.mobileno.message}</p>
          )}

          <input
            {...register("email")}
            type="email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Email Address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            type="password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <input
            {...register("confirmPassword")}
            type="password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          <span className="text-sm text-gray-600 text-center">
            By creating an account, I consent to the processing of my personal
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
