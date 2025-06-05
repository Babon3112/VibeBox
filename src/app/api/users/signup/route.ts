import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { deleteFromCloudinary, uploadOnCloudinary, UploadResponse } from "@/utils/cloudinary.util";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const data = {
      avatar: formData.get("avatar"),
      fullname: formData.get("fullname"),
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      mobileno: formData.get("mobileno"),
      password: formData.get("password") as string,
    };

    const { avatar, fullname, username, mobileno, email, password } = data;

    if (!avatar || !fullname || !username || !mobileno || !email || !password) {
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
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await userToUpdate.save();
    } else {
      const newUser = new UserModel({
        avatar: avatarUrl,
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await newUser.save();
    }
    return Response.json(
      { success: true, message: "Signup successful." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return Response.json(
      { success: false, message: error.message || "Signup failed." },
      { status: 500 }
    );
  }
}
