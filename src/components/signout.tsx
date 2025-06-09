"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomSnackbar from "./CustomSnackbar";

const SignOut = () => {
  const router = useRouter();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const res = await fetch("/api/users/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Signed out successfully.");
        setSnackbarOpen(true);

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(data.message || "Signout failed.");
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarSeverity("error");
      setSnackbarMessage("An error occurred during signout.");
      setSnackbarOpen(true);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="flex items-center space-x-1 cursor-pointer"
      >
        <p>Logout</p> <LogoutIcon sx={{ fontSize: 15 }} />
      </button>

      <CustomSnackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default SignOut;
