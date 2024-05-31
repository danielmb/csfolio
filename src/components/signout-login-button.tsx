"use client";

import React from "react";

import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { signOut, signIn } from "next-auth/react";
import { FormattedMessage } from "react-intl";

export const SignOutLoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <Button
        onClick={() => signOut()}
        className="test bg-destructive"
        variant="destructive"
      >
        <FormattedMessage id="logOut" defaultMessage="Log out" />
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => signIn("steam")}
        className="test bg-primary"
        variant="default"
      >
        <FormattedMessage id="logIn" defaultMessage="Log in" />
      </Button>
    );
  }
};
