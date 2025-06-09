"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LogoutIcon from "@mui/icons-material/Logout";

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

export default SignOut;
