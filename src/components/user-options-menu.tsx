"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import UserAvatar from "./user-avatar";
import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
interface UserOptionsMenuProps {
  session: Session | null;
}
export const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({
  session,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <UserAvatar />
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          {/* <CommandInput placeholder="Type a command or search..." /> */}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Settings</CommandItem>
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
                  Log out
                </CommandItem>
              ) : (
                <CommandItem
                  onSelect={() => {
                    signIn("steam").catch(console.error);
                  }}
                >
                  Log in
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
