"use client";
import Link from "next/link";

const SigninPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-[#F9FAFB] p-6">
      <div className="flex flex-col justify-center items-center shadow-2xl p-8 border rounded-3xl bg-white w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 tracking-wide">
          Welcome Back
        </h1>
        <form className="flex flex-col items-center space-y-4 w-full">
          <input
            type="text"
            name="email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Registered email or mobile no ....."
          />
          <input
            type="password"
            name="password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder="Your password"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 rounded-xl w-full hover:bg-pink-500 transition focus:outline-none focus:ring-4 focus:ring-pink-500/50"
          >
            Sign in
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
