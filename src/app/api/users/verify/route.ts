import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    await dbConnect();

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }
    user.isverified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save();

    return Response.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { success: false, message: "Error verifying user." },
      { status: 500 }
    );
  }
}
