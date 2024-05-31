"use client";
import * as React from "react";
import { useLanguage } from "../language-provider/language-provider";
import { DateTimeFormatter } from "./date-time-formatter";
import { type IDateTimeFormatter } from "./date-time-formatter.interface";

export const DateTimeFormatContext = React.createContext<IDateTimeFormatter>(
  {} as IDateTimeFormatter,
);

export const DateTimeFormatterProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  // Get current language from language provider context.
  const [language] = useLanguage();

  // Memoize if needed.
  const dateTimeFormatter = new DateTimeFormatter(language);

  return (
    <DateTimeFormatContext.Provider value={dateTimeFormatter}>
      {children}
    </DateTimeFormatContext.Provider>
  );
};

export const useDateTimeFormatter = () =>
  React.useContext(DateTimeFormatContext);
