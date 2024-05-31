"use client";
import React, { useState } from "react";
import { languageMap, type LocaleType } from "./language-map";
import { useLocalStorage } from "@uidotdev/usehooks";

export const LanguageProviderContext = React.createContext<
  [string, (lang: LocaleType) => void]
>([
  "en-US",
  () => {
    void 0;
  },
]);

export const LanguageProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  const [language, setLanguage] = useState<LocaleType>(
    // "language",
    // navigator.language in languageMap
    //   ? (navigator.language as LocaleType)
    //   : "en-US",
    "en-US",
  );
  return (
    <LanguageProviderContext.Provider value={[language, setLanguage]}>
      {children}
    </LanguageProviderContext.Provider>
  );
};

export const useLanguage = () => React.useContext(LanguageProviderContext);
