import * as z from "zod";
import { usernameValidation } from "./username.schema";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "Too short, Min 3 chars")
      .max(20, "Too long, Max 20 chars"),
    lastName: z
      .string()
      .min(3, "Too short, Min 3 chars")
      .max(20, "Too long, Max 20 chars"),
    username: usernameValidation,
    dob_day: z
    .string()
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 31, { message: "Invalid day" }),
  dob_month: z
    .string()
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 12, { message: "Invalid month" }),
  dob_year: z
    .string()
    .refine((val) => parseInt(val) > 1900 && parseInt(val) <= new Date().getFullYear(), {
      message: "Invalid year",
    }),
    gender: z.enum(["male", "female", "other"]),
    mobileno: z.string().length(10, "Mobile number must be 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Too short, must 8 characters required")
      .max(50),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
