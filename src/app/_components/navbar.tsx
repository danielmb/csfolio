import React from "react";
// import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { CogIcon, MoonIcon, SettingsIcon } from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HeaderLink } from "./navbar-link";
import { LanguageSelector } from "@/components/language-selector";
import { FormattedMessage } from "react-intl";
import { TranslationType } from "../_layout/language-provider/translations/en-US";
import { SignOutLoginButton } from "@/components/signout-login-button";
interface Page {
  name: string;
  intlId?: TranslationType;
  href: string;
}
const pages: Page[] = [
  {
    name: "Dashboard",
    intlId: "dashboard",
    href: "/",
  },
  {
    name: "Inventory Management",
    intlId: "inventoryManagement" as const,
    href: "/settings",
  },
  {
    name: "???",
    href: "/idk",
  },
  {
    name: "???",
    href: "/idk2",
  },
];
export const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white  dark:border-gray-800 dark:bg-black">
      <div className="flex flex-col items-center justify-between  py-2">
        <div className="flex w-full items-center justify-between px-4">
          {/* Empty div for spacing */}
          <div></div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-lg font-bold">
              CSFOL.IO
            </a>
          </div>
          <div className="flex items-center space-x-1">
            {/* Make the icons blue on light mode */}
            <SettingsIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" />
            {/* <MoonIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" /> */}
            <DarkModeToggle />
            <LanguageSelector />
            <SignOutLoginButton />
          </div>
        </div>

        <div className="border-black-200 w-full border-2 px-7 dark:border-gray-800">
          <div className="spaxe-x-1 flex w-full items-center justify-between">
            {pages.map((page, i) => (
              <HeaderLink
                key={i}
                href={page.href}
                name={page.name}
                intlId={page.intlId}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
