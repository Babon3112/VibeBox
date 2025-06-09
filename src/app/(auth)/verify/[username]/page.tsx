"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomSnackbar from "@/components/CustomSnackbar";

const VerifyAccountPage = () => {
  const router = useRouter();
  const { username } = useParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);
    try {
      await axios.post("/api/users/verify", {
        username,
        code: data.code,
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("Account verified successfully.");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError;
      setSnackbarSeverity("error");
      setSnackbarMessage(
        (error.response?.data as string) || "Verification failed"
      );
      setSnackbarOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF5F5]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 space-y-4 bg-opacity-90 rounded-3xl shadow-lg border border-red-500 bg-white"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-red-500">
            Verify Your Account
          </h1>
          <p>Enter the verification code sent to your email.</p>
        </div>

        <div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            {...register("code")}
            placeholder="Verification Code"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-red-500 hover:border-red-500 placeholder:text-gray-400"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
        <p>Please enter the 6-digit code.</p>
        <button
          type="submit"
          className="bg-red-500 text-white font-bold py-3 rounded-xl w-full hover:bg-orange-500 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isVerifying || !isValid}
        >
          {isVerifying ? (
            <div className="flex items-center justify-center space-x-3">
              <GradientCircularProgress />
              <p>Verifying . . . . .</p>
            </div>
          ) : (
            "Verify"
          )}
        </button>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default VerifyAccountPage;