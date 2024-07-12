"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EnableButtonProps {
  children: React.ReactNode;
  enableText: React.ReactNode;
  disableText: React.ReactNode;
}
export const EnableButton = ({
  children,
  disableText,
  enableText,
}: EnableButtonProps) => {
  const [enable, setEnable] = useState(false);
  return (
    <div className="w-1/2">
      <Button onClick={() => setEnable((prev) => !prev)}>
        {enable ? disableText : enableText}
      </Button>
      {enable && children}
    </div>
  );
};
