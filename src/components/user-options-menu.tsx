"use client";
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandList,
  CommandDialog,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import LoggedInUserAvatar from "./user-avatar";
import { type Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { CogIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
interface UserOptionsMenuProps {
  session: Session | null;
}
export const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({
  session,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Button onClick={() => setIsOpen((prev) => !prev)} variant={"ghost"}>
        <LoggedInUserAvatar />
      </Button>
      {/* </PopoverTrigger>
      <PopoverContent> */}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        {/* <CommandInput placeholder="Type a command or search..." /> */}
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {session && (
            <CommandItem className="flex flex-row space-x-4">
              <LoggedInUserAvatar />
              <span>{session.user.name}</span>
            </CommandItem>
          )}
          <CommandSeparator />
          <CommandGroup heading="Settings">
            {session && (
              <CommandItem
                onSelect={() => {
                  router.push("/profile");
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </CommandItem>
            )}
            <CommandItem>
              <CogIcon className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            {/* <CommandItem>Log out</CommandItem> */}

            {session ? (
              <CommandItem
                onSelect={() => {
                  signOut().catch(console.error);
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </CommandItem>
            ) : (
              <CommandItem
                onSelect={() => {
                  signIn("steam").catch(console.error);
                }}
              >
                <LogInIcon className="mr-2 h-4 w-4" />
                Log in
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
