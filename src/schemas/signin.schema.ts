import { z } from "zod";

export const signinSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});
