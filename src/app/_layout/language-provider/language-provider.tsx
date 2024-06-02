"use client";
import React, { useEffect, useMemo, useState } from "react";
import { languageMap, type LocaleType } from "./language-map";
// supportedLocaleOf
export const LanguageProviderContext = React.createContext<
  [string, (lang: LocaleType) => void, string]
>([
  "en-US",
  () => {
    void 0;
  },
  "English US",
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

  const languageName = useMemo(
    () => languageMap[language ?? "en-US"],
    [language],
  );
  console.log("lang", language);
  return (
    <LanguageProviderContext.Provider
      value={[language ?? "en-US", setLanguage, languageName]}
    >
      {children}
    </LanguageProviderContext.Provider>
  );
};

export const useLanguage = () => React.useContext(LanguageProviderContext);
