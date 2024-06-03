import React from "react";
import { getServerAuthSession } from "@/server/auth";
import RegisterForm from "./components/register-form";

export default async function RegisterPage() {
  const session = await getServerAuthSession();

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
}
