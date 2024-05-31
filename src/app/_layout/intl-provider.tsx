"use client";

import React, { useMemo } from "react";
import { IntlProvider } from "react-intl";
import { useLanguage } from "./language-provider/language-provider";
import { type LocaleType, messagesMap } from "./language-provider/language-map";
export const IntlLanguageProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  const [language] = useLanguage();
  const messages = useMemo(
    () => messagesMap[language as LocaleType],
    [language],
  );
  return (
    <IntlProvider locale={language} messages={messages}>
      {children}
    </IntlProvider>
  );
};
