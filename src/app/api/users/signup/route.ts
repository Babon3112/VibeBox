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
    const fields = [
      "avatar", "firstName", "lastName", "dob", "gender",
      "username", "mobileno", "email", "password", "verifyUrl"
    ];
    const values: Record<string, string | File> = {};

    for (const field of fields) {
      const value = formData.get(field);
      if (!value) {
        return Response.json(
          { success: false, message: "All fields are required" },
          { status: 400 }
        );
      }
      values[field] = value;
    }

    const hashedPassword = await bcryptjs.hash(values.password as string, 10);

    let avatarUrl = "";
    if (values.avatar instanceof File) {
      const buffer = Buffer.from(await values.avatar.arrayBuffer());
      const uploadResponse: UploadResponse = await uploadOnCloudinary(buffer, "VibeBox/Avatar");
      if (!uploadResponse.url) {
        console.error("Avatar upload failed:", uploadResponse.error);
        return Response.json(
          { success: false, message: "Avatar upload failed" },
          { status: 500 }
        );
      }
      avatarUrl = uploadResponse.url;
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const existingUserByEmail = await UserModel.findOne({ email: values.email });
    const existingUserByMobile = await UserModel.findOne({ mobileno: values.mobileno });

    if (existingUserByEmail?.isverified) {
      return Response.json(
        { success: false, message: "Email is already registered." },
        { status: 400 }
      );
    }

    if (existingUserByMobile?.isverified) {
      return Response.json(
        { success: false, message: "Mobile number is already registered." },
        { status: 400 }
      );
    }

    const userToUpdate = existingUserByEmail || existingUserByMobile;

    const userData = {
      avatar: avatarUrl,
      firstName: values.firstName,
      lastName: values.lastName,
      username: (values.username as string).toLowerCase(),
      dob: new Date(values.dob as string),
      gender: values.gender,
      mobileno: values.mobileno,
      email: (values.email as string).toLowerCase(),
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
    };

    if (userToUpdate) {
      await deleteFromCloudinary(userToUpdate.avatar);
      Object.assign(userToUpdate, userData);
      await userToUpdate.save();
    } else {
      const newUser = new UserModel(userData);
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      values.email as string,
      values.username as string,
      verifyCode,
      values.verifyUrl as string
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Signup successful. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return Response.json(
      { success: false, message: error instanceof Error ? error.message : "Signup failed." },
      { status: 500 }
    );
  }
}