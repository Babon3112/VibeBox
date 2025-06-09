"use client";

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface CustomSnackbarProps {
  open: boolean;
  severity: "success" | "error";
  message: string;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  severity,
  message,
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      aria-live="assertive"
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          fontSize: "1.2rem",
          borderRadius: 2,
          alignItems: "center",
          width: "100%",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
