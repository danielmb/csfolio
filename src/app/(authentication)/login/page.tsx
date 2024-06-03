import React from "react";
import { getServerAuthSession } from "@/server/auth";
import { LoginForm } from "./components/login-form";

export default async function LoginPage() {
  const session = await getServerAuthSession();
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
