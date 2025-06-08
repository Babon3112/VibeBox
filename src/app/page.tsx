import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Signin from "../components/signin";
import Dashboard from "@/components/dashboard";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  return (
    <main>
      {isAuthenticated ? <Dashboard /> : <Signin />}
    </main>
  );
}