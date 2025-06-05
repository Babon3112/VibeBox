import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { mobileno: identifier }],
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    if (!user.isverified) {
      return Response.json(
        { success: false, message: "Please verify your account first." },
        { status: 403 }
      );
    }

    // In real apps, you'd set a cookie/token here
    return Response.json(
      { success: true, message: "Signin successful", userId: user._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signin Error:", error);
    return Response.json(
      { success: false, message: error.message || "Signin failed." },
      { status: 500 }
    );
  }
}
