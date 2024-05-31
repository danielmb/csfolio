"use client";
import React from "react";
import { useLanguage } from "@/app/_layout/language-provider/language-provider";
import {
  languageMap,
  type LocaleType,
} from "@/app/_layout/language-provider/language-map";

export const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as LocaleType)}
    >
      {Object.entries(languageMap).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};
