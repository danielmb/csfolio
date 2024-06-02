// import enUsTranslation from ";
// import nbNoMessages from "../../../i18n/nb-NO";
import enUsTranslation from "@/i18n/locales/en-US.json";
import nbNoMessages from "@/i18n/locales/nb-NO.json";
export const languageMap = {
  "en-US": "English US",
  // "en-GB": "English UK",
  // hi: "Hindi",
  // ja: "Japanese",
  "nb-NO": "Norsk",
} as const;

export const messagesMap = {
  "en-US": enUsTranslation,
  "nb-NO": nbNoMessages,
} as const;

export type LocaleType = keyof typeof languageMap;

export type TranslationType = keyof typeof enUsTranslation;
