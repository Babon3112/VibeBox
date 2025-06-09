"use client";
import { signupSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as React from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import Image from "next/image";

const SignupPage = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [passwordShow, setPasswordShow] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  function GradientCircularProgress() {
    return (
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
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: undefined,
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
      setSnackbarSeverity("error");
      setSnackbarMessage("Avatar is required");
      setSnackbarOpen(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);
      formData.append("username", data.username.toLowerCase());
      formData.append("mobileno", data.mobileno);
      formData.append("email", data.email.toLowerCase());
      formData.append("password", data.password);

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const verifyUrl = `${baseUrl}/verify/${data.username}`;
      formData.append("verifyUrl", verifyUrl);

      const res = await axios.post("/api/users/signup", formData);
      if (res.status === 201) {
        setSnackbarSeverity("success");
        setSnackbarMessage(res.data.message);
        setSnackbarOpen(true);
        setTimeout(() => {
          router.replace(`/verify/${data.username}`);
        }, 1500);
      }
    } catch (error: unknown) {
      let errorMessage = "Signup failed.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (axios.isAxiosError(error)) {
        // error is typed as AxiosError here
        if (
          error.response?.data &&
          typeof error.response.data.message === "string"
        ) {
          errorMessage = error.response.data.message;
        }
      }

      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#FFF5F5] p-6">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-red-600">
        VibeBox
      </h1>
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border border-red-600 rounded-3xl bg-white max-w-lg w-full">
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
          <div className="grid grid-cols-2 gap-4">
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
          <input
            {...register("dob")}
            type="date"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 text-gray-400"
          />
          {errors.dob && (
            <p className="text-red-500 text-xs">{errors.dob.message}</p>
          )}

          <select
            {...register("gender")}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 text-gray-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="custom">Custom</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs">{errors.gender.message}</p>
          )}

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="flex w-full">
                <input
                  {...register("password")}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Password"
                  className="border border-r-0 border-gray-300 p-3 rounded-l-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setPasswordShow(!passwordShow)}
                  className={`text-gray-500 border-gray-300 rounded-none rounded-r-lg hover:bg-white border border-l-0 bg-transparent p-3 ${
                    isFocused ? "outline-none border-red-500 border-l-0" : ""
                  }`}
                >
                  {passwordShow ? (
                    <VisibilityOff className="w-5 h-5" />
                  ) : (
                    <Visibility className="w-5 h-5" />
                  )}
                </button>
              </label>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("confirmPassword")}
                type={passwordShow ? "text" : "password"}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
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
            className="bg-red-600 text-white font-bold py-3 rounded-xl w-full hover:bg-orange-500 transition cursor-pointer disabled:cursor-not-allowed"
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            alignItems: "center",
            width: "100%",
            fontSize: "1.2rem",
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignupPage;
