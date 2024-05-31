"use client";
import React from "react";
import { languageMap, type LocaleType } from "./language-map";
import { useLocalStorage } from "@uidotdev/usehooks";

export const LanguageProviderContext = React.createContext<
  [string , (lang: LocaleType) => void]
>([
  "en-US",
  () => {
    void 0;
  },
]);

export const LanguageProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  // Memoize if needed. Set en-US as default locale
  // const [language, setLanguage] = React.useState<LocaleType>(navigator.language in languageMap ? navigator.language as LocaleType : "en-US");
  
  

  // const [language, setLanguage] = useLocalStorage<LocaleType>("language", "en-US");
  const [language, setLanguage] = useLocalStorage<LocaleType>("language", navigator.language in languageMap ? navigator.language as LocaleType : "en-US");
  return (
    <LanguageProviderContext.Provider value={[language, setLanguage]}>
      {children}
    </LanguageProviderContext.Provider>
  );
};

export const useLanguage = () => React.useContext(LanguageProviderContext);
