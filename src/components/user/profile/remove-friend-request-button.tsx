"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useUser } from "../user-provider";

const FriendRequestControl = () => {
  const { friendRequest, update: updateUser } = useUser();
};

export default FriendRequestControl;
