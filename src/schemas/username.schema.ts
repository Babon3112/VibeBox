import * as z from "zod";

export const usernameValidation = z
  .string()
  .min(3, "UserName must be atleast 3 charecters")
  .max(20, "UserName must be atmost 20 charecters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );
