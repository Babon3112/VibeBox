import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { mobileno: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (!user.isverified) {
      return NextResponse.json(
        { success: false, message: "Please verify your account first." },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { success: true, message: "Signin successful", userId: user._id },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Signin Error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage || "Signin failed." },
      { status: 500 }
    );
  }
}
