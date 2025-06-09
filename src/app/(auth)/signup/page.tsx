"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signupSchema } from "@/schemas/signup.schema";
import CustomSnackbar from "@/components/CustomSnackbar";

const SignupPage = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob_day: "",
      dob_month: "",
      dob_year: "",
      gender: undefined,
      username: "",
      mobileno: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const GradientCircularProgress = () => (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e53935" />
            <stop offset="100%" stopColor="#fb8c00" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={25}
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </>
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatar(e.target.files[0]);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const signup = async (data: z.infer<typeof signupSchema>) => {
    if (!avatar) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Avatar is required");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const { dob_day, dob_month, dob_year } = data;
      const dob = `${dob_year}-${dob_month.padStart(2, "0")}-${dob_day.padStart(
        2,
        "0"
      )}`;

      formData.append("avatar", avatar);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("username", data.username.toLowerCase());
      formData.append("dob", dob);
      formData.append("gender", data.gender);
      formData.append("mobileno", data.mobileno);
      formData.append("email", data.email.toLowerCase());
      formData.append("password", data.password);

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      formData.append("verifyUrl", `${baseUrl}/verify/${data.username}`);

      const res = await axios.post("/api/users/signup", formData);

      if (res.status === 201) {
        setSnackbarSeverity("success");
        setSnackbarMessage(res.data.message);
        setSnackbarOpen(true);
        setTimeout(() => router.replace(`/verify/${data.username}`), 1500);
      }
    } catch (error: unknown) {
      let message = "Signup failed.";
      if (axios.isAxiosError(error)) {
        if (typeof error.response?.data?.message === "string") {
          message = error.response.data.message;
        } else if (typeof error.message === "string") {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setSnackbarSeverity("error");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#FFF5F5] p-6">
      <h1 className="text-5xl font-bold mb-6 tracking-tight text-red-600">
        VibeBox
      </h1>
      <div className="flex flex-col justify-center items-center shadow-2xl px-8 py-6 border border-red-600 rounded-3xl bg-white max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-red-600 tracking-wide">
          Create Your Account
        </h1>

        <form
          className="flex flex-col items-center space-y-4 w-full"
          onSubmit={handleSubmit(signup)}
        >
          <label
            htmlFor="avatar"
            className="cursor-pointer relative rounded-full overflow-hidden w-28 h-28 shadow-xl border-2 border-red-500 hover:border-orange-500 transition-colors"
          >
            <Image
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
              }
              alt="Avatar Preview"
              fill
              className="object-cover"
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

          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <input
                {...register("firstName")}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("lastName")}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <input
            {...register("username")}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username.message}</p>
          )}
          <div className="w-full flex items-center border border-gray-300 py-2 rounded-lg justify-around hover:border-red-500">
            <label className="font-semibold text-gray-800">Date of Birth</label>
            <div className="flex gap-2">
              <select
                {...register("dob_day")}
                className="flex px-2 py-1 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 hover:border-red-500 w-28 items-center justify-between peer-checked:border-red-500"
              >
                <option value="">Day</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                {...register("dob_month")}
                className="flex px-2 py-1 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 hover:border-red-500 w-28 items-center justify-between peer-checked:border-red-500"
              >
                <option value="">Month</option>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                {...register("dob_year")}
                className="flex px-2 py-1 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 hover:border-red-500 w-28 items-center justify-between peer-checked:border-red-500"
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="flex items-center border border-gray-300 rounded-xl py-1 w-full hover:border-red-500 justify-around">
            <label className="font-semibold text-gray-800">Gender</label>
            <div className="flex gap-4 py-1">
              {["Female", "Male", "Other"].map((label) => (
                <label
                  key={label}
                  className="flex px-3 py-1 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 hover:border-red-500 w-32 items-center justify-between peer-checked:border-red-500"
                >
                  <span className="text-gray-700">{label}</span>
                  <input
                    type="radio"
                    value={label.toLowerCase()}
                    {...register("gender")}
                    className="peer accent-red-500"
                  />
                </label>
              ))}
            </div>
          </div>
          <input
            {...register("mobileno")}
            type="number"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
            placeholder="Mobile Number"
          />
          {errors.mobileno && (
            <p className="text-red-500 text-xs">{errors.mobileno.message}</p>
          )}
          <input
            {...register("email")}
            type="email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
            placeholder="Email Address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <div className="flex gap-2">
            <div>
              <input
                {...register("password")}
                type={passwordShow ? "text" : "password"}
                placeholder="Password"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500 placeholder:text-gray-400"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPasswordShow(!passwordShow)}
              className={`text-gray-500 rounded-lg hover:bg-white border bg-transparent p-3 h-12.5 hover:border-orange-500 ${
                passwordShow ? "border-red-500" : "border-gray-300"
              }`}
            >
              {passwordShow ? (
                <VisibilityOff className="w-5 h-5" />
              ) : (
                <Visibility className="w-5 h-5" />
              )}
            </button>
            <div>
              <input
                {...register("confirmPassword")}
                type={passwordShow ? "text" : "password"}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500 placeholder:text-gray-400"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-600 text-center">
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </span>
          <button
            type="submit"
            className="bg-red-600 text-white font-bold py-3 rounded-xl w-full hover:bg-orange-500 transition cursor-pointer disabled:bg-orange-500 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <GradientCircularProgress />
                <p>Signing up . . . . .</p>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-red-600 hover:text-orange-500 underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <CustomSnackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default SignupPage;
