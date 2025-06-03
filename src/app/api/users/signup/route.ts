import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const data = {
      //   avatar: formData.get("avatar"),
      fullname: formData.get("fullname"),
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      mobileno: formData.get("mobileno"),
      password: formData.get("password") as string,
    };

    const { fullname, username, mobileno, email, password } = data;

    if (!fullname || !username || !mobileno || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

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
      Object.assign(userToUpdate, {
        fullname,
        username: username.toLowerCase(),
        mobileno,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await userToUpdate.save();
    } else {
      const newUser = new UserModel({
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
