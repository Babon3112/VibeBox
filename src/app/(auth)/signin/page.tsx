"use client";
import { signinSchema } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SigninPage = () => {
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

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      const response = await axios.post("/api/users/signin", data);

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#F9FAFB] p-6">
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border rounded-3xl bg-white max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 tracking-wide">
          Welcome Back
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-4 w-full"
        >
          <input
            {...register("identifier")}
            placeholder="Email or Mobile Number"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
          {errors.identifier && (
            <p className="text-sm text-red-500">{errors.identifier.message}</p>
          )}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 rounded-xl w-full hover:bg-pink-500 transition focus:outline-none focus:ring-4 focus:ring-pink-500/50"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          New to VibeBox?{" "}
          <Link
            href="/signup"
            className="text-blue-500 hover:text-pink-500 underline"
          >
            Sign up
          </Link>
        </p>

        <Link
          href="/forgotpassword"
          className="text-blue-500 mt-1 text-sm hover:text-pink-500 underline"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default SigninPage;
