import enUsTranslation from "./translations/en-US";
import nbNoMessages from "./translations/nb-NO";

export const languageMap = {
  "en-US": "English US",
  // "en-GB": "English UK",
  // hi: "Hindi",
  // ja: "Japanese",
  "nb-NO": "Norsk",
};

export const messagesMap = {
  "en-US": enUsTranslation,
  "nb-NO": nbNoMessages,
};

export type LocaleType = keyof typeof languageMap;

export { type TranslationType as translationType } from "./translations/en-US";
