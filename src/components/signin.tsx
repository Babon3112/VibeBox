"use client";

import { signinSchema } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomSnackbar from "./CustomSnackbar";

const Signin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [isFocused, setIsFocused] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [passwordShow, setPasswordShow] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  function GradientCircularProgress() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/signin", data);
      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Signed in successfully.");
        setSnackbarOpen(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: unknown) {
      let errorMessage = "Signin failed.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FFF5F5] p-6 justify-center">
      <div className="hidden md:flex flex-col justify-center items-start flex-1 bg-red-600 text-white p-12 rounded-l-3xl shadow-2xl max-w-lg">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">VibeBox</h1>
        <p className="text-lg leading-relaxed mb-8">
          Experience the ultimate platform to connect, create, and celebrate
          your vibe. Join the community and unlock your potential.
        </p>
        <p className="italic text-sm opacity-75">Your vibe, your story.</p>
      </div>
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border border-red-600 rounded-r-3xl bg-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600 tracking-wide">
          Welcome Back
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-4 w-full"
        >
          <input
            {...register("identifier")}
            placeholder="Email or Mobile Number"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
          />
          {errors.identifier && (
            <p className="text-sm text-red-500">{errors.identifier.message}</p>
          )}

          <div className="flex w-full">
            <input
              {...register("password")}
              type={passwordShow ? "text" : "password"}
              placeholder="Password"
              className="border border-r-0 border-gray-300 p-3 rounded-l-lg w-full focus:outline-none focus:border-red-500 placeholder:text-gray-400"
              aria-label="Password"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button
              type="button"
              onClick={() => setPasswordShow(!passwordShow)}
              aria-label={passwordShow ? "Hide password" : "Show password"}
              className={`text-gray-500 rounded-none rounded-r-lg hover:bg-white border border-l-0 bg-transparent p-3 ${
                isFocused
                  ? "outline-none border-red-500 border-l-0"
                  : "border-gray-300"
              }`}
            >
              {passwordShow ? (
                <VisibilityOff className="w-5 h-5" />
              ) : (
                <Visibility className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="bg-red-600 text-white font-bold py-3 rounded-xl w-full hover:bg-orange-500 transition focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:bg-orange-500"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <GradientCircularProgress />
                <p>Signing in . . . . .</p>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <Link
          href="/forgotpassword"
          className="text-red-600 text-sm hover:text-orange-500 mt-4 underline"
        >
          Forgotten Password?
        </Link>
        <hr className="border-red-200 w-full my-4"/>
        <Link
          href="/signup"
          className="bg-red-600 w-52 p-3 text-white font-bold hover:bg-orange-500 text-center rounded-xl flex items-center justify-center"
        >
          Create new account
        </Link>
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

export default Signin;
