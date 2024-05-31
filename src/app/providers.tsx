"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { LanguageProvider } from "./_layout/language-provider/language-provider";
import { DateTimeFormatterProvider } from "./_layout/date-time-formatter/date-time-formatter-provider";
import { IntlLanguageProvider } from "./_layout/intl-provider";
import { SessionProvider } from "next-auth/react";

export const Providers: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <SessionProvider>
      <ThemeProvider {...props}>
        <LanguageProvider>
          <DateTimeFormatterProvider>
            <IntlLanguageProvider>{children}</IntlLanguageProvider>
          </DateTimeFormatterProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};
