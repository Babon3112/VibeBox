"use client";
import { signinSchema } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
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
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response?.data?.message === "string"
      ) {
        errorMessage = (error as any).response.data.message;
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
      {/* Left branding side */}
      <div className="hidden md:flex flex-col justify-center items-start flex-1 bg-red-600 text-white p-12 rounded-l-3xl shadow-2xl max-w-lg">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">VibeBox</h1>
        <p className="text-lg leading-relaxed mb-8">
          Experience the ultimate platform to connect, create, and celebrate
          your vibe. Join the community and unlock your potential.
        </p>
        <p className="italic text-sm opacity-75">Your vibe, your story.</p>
      </div>

      {/* Right signin form side */}
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
                isFocused ? "outline-none border-red-500" : ""
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
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="bg-red-600 text-white font-bold py-3 rounded-xl w-full hover:bg-orange-500 transition focus:outline-none focus:ring-4 focus:ring-orange-400/50 cursor-pointer disabled:cursor-not-allowed"
            disabled={isSubmitting}
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

        <p className="mt-4 text-sm text-center text-gray-600 w-full">
          New to VibeBox?{" "}
          <Link
            href="/signup"
            className="text-red-600 hover:text-orange-500 underline"
          >
            Sign up
          </Link>
        </p>

        <Link
          href="/forgotpassword"
          className="text-red-600 mt-1 text-sm hover:text-orange-500 underline"
        >
          Forgot Password?
        </Link>
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
            fontSize: "1.2rem",
            borderRadius: 2,
            alignItems: "center",
            width: "100%",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signin;
