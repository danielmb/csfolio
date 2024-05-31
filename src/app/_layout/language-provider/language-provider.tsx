"use client";
import React, { useEffect, useState } from "react";
import { languageMap, type LocaleType } from "./language-map";
import { useLocalStorage } from "@uidotdev/usehooks";
// supportedLocaleOf
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
  const [language, setLanguage] = useState<LocaleType>();

  if (typeof window !== "undefined") {
    console.log(navigator?.language in languageMap, navigator?.language);
  }
  // "language",
  // navigator.language in languageMap
  //   ? (navigator.language as LocaleType)
  //   : "en-US",
  // "en-US",

  useEffect(() => {
    setLanguage(localStorage.getItem("language") as LocaleType);
  }, []);
  useEffect(() => {
    language && localStorage.setItem("language", language);
  }, [language]);
  console.log("lang", language);
  return (
    <LanguageProviderContext.Provider
      value={[language ?? "en-US", setLanguage]}
    >
      {children}
    </LanguageProviderContext.Provider>
  );
};

export const useLanguage = () => React.useContext(LanguageProviderContext);
