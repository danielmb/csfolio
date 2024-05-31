"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();
  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  return (
    // <Button
    //   onClick={() => {
    //     setTheme(theme === "dark" ? "light" : "dark");
    //   }}
    // >
    //   <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //   <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //   <span className="sr-only">Toggle theme</span>
    // </Button>
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="hidden"
        id="dark-mode-toggle"
        onChange={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      />
      <label
        htmlFor="dark-mode-toggle"
        className="flex h-6 w-12 cursor-pointer items-center justify-between rounded-full bg-gray-300 p-1 transition-transform duration-300 ease-in-out dark:bg-gray-700"
      >
        {/* <span className="h-4 w-4 transform rounded-full bg-black shadow-md transition-transform dark:bg-white" /> */}
        <span
          className={cn(
            "absolute h-4 w-4 transform rounded-full bg-black shadow-md transition-transform dark:bg-white",
            isDark ? "translate-x-6" : "translate-x-0",
          )}
        />
        <Moon className="h-4 w-4 text-white dark:text-black" />
        <Sun className="h-4 w-4 text-white dark:text-black" />
      </label>
    </div>
  );
}
