"use client";
import React from "react";
import { useLanguage } from "@/app/_layout/language-provider/language-provider";
import {
  languageMap,
  type LocaleType,
} from "@/app/_layout/language-provider/language-map";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export const LanguageSelector: React.FC = () => {
  const [language, setLanguage, languageName] = useLanguage();

  return (
    // <select
    //   value={language}
    //   onChange={(e) => setLanguage(e.target.value as LocaleType)}
    // >
    //   {Object.entries(languageMap).map(([key, value]) => (
    //     <option key={key} value={key}>
    //       {value}
    //     </option>
    //   ))}
    // </select>

    <Select
      onValueChange={(value) => setLanguage(value as LocaleType)}
      defaultValue={language}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={languageName} />
      </SelectTrigger>
      <SelectContent>
        {/* <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem> */}
        {Object.entries(languageMap).map(([key, value]) => (
          <SelectItem
            key={key}
            value={key}
            onClick={() => setLanguage(key as LocaleType)}
          >
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
