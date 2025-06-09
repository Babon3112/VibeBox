import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  UploadResponse,
} from "@/utils/cloudinary.util";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const avatar = formData.get("avatar") as File;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const username = formData.get("username") as string;
    const mobileno = formData.get("mobileno") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const verifyUrl = formData.get("verifyUrl") as string;

    if (
      !avatar ||
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !username ||
      !mobileno ||
      !email ||
      !password ||
      !verifyUrl
    ) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    let avatarUrl = "";
    if (avatar && avatar instanceof File) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const uploadResponse: UploadResponse = await uploadOnCloudinary(
        buffer,
        "VibeBox/Avatar"
      );

      if (uploadResponse.url) {
        avatarUrl = uploadResponse.url;
      } else {
        console.error("Avatar upload failed:", uploadResponse.error);
        return Response.json(
          { success: false, message: "Avatar upload failed" },
          { status: 500 }
        );
      }
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByMobile = await UserModel.findOne({ mobileno });

    if (existingUserByEmail && existingUserByEmail.isverified) {
      return Response.json(
        { success: false, message: "Email is already registered." },
        { status: 400 }
      );
    }

    if (existingUserByMobile && existingUserByMobile.isverified) {
      return Response.json(
        { success: false, message: "Mobile number is already registered." },
        { status: 400 }
      );
    }

    const userToUpdate = existingUserByEmail || existingUserByMobile;

    if (userToUpdate) {
      await deleteFromCloudinary(userToUpdate.avatar);
      Object.assign(userToUpdate, {
        avatar: avatarUrl,
        firstName,
        lastName,
        username: username.toLowerCase(),
        dob: new Date(dob),
        gender,
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
      });
      await userToUpdate.save();
    } else {
      const newUser = new UserModel({
        avatar: avatarUrl,
        firstName,
        lastName,
        username: username.toLowerCase(),
        dob: new Date(dob),
        gender,
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
      verifyUrl
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Signup successful. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    let errorMessage = "Signup failed";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Signup Error:", error);
    return Response.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
