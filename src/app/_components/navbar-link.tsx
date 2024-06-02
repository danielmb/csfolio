"use client";

import React from "react";
// to get the url
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FormattedMessage } from "react-intl";
interface HeaderLinkProps {
  href: string;
  name: string;
  intlId?: TranslationType | undefined;
}
import { useSession } from "next-auth/react";
import { type TranslationType } from "../_layout/language-provider/language-map";
export const HeaderLink = ({ href, name, intlId }: HeaderLinkProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    // className="flex w-full items-center justify-center space-x-4 rounded-lg border-x p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
    // <div className="flex w-full items-center justify-center space-x-4 rounded-lg border-x p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
    <div
      className={cn(
        "flex w-full items-center justify-center space-x-4 rounded-lg border-x hover:bg-gray-100 dark:hover:bg-gray-900",
        {
          "bg-gray-100": pathname === href,
          "dark:bg-gray-900": pathname === href,
        },
      )}
    >
      <Link
        href={href}
        // className={`${
        //   pathname === href ? "text-blue-500" : "text-gray-500"
        // } hover:text-blue-500 dark:hover:text-blue-300`}
        className={cn(
          "w-full p-2 text-center hover:text-blue-500 dark:hover:text-blue-300",
          {
            "text-blue-500": pathname === href,
            "text-gray-500": pathname !== href,
          },
        )}
      >
        {intlId ? (
          <FormattedMessage id={intlId} defaultMessage={name} />
        ) : (
          <>{name}</>
        )}
      </Link>
    </div>
  );
};
