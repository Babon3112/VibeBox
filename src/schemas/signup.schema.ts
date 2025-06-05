import * as z from "zod";
import { usernameValidation } from "./username.schema";

export const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(4, "Full name must be at least 4 characters")
      .max(30, "Full name must be at most 30 characters"),
    username: usernameValidation,
    mobileno: z.string().length(10, "Mobile number must be 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
