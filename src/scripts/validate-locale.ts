import path from "path";
import fs from "fs";
const primaryLocale = "en-US";
const translationsFolder = path.join(__dirname, "../src/i18n/locales");

const primaryLocaleFile = path.join(
  translationsFolder,
  `${primaryLocale}.json`,
);

const primaryLocaleContent = fs.readFileSync(primaryLocaleFile, "utf8");
interface TranslationType {
  [key: string]: string | TranslationType;
}
const primaryLocaleMessages = JSON.parse(
  primaryLocaleContent,
) as TranslationType;

const validateLocale = (locale: string) => {
  const localeFile = path.join(translationsFolder, locale);
  const localeContent = fs.readFileSync(localeFile, "utf8");
  const localeMessages = JSON.parse(localeContent) as TranslationType;

  const missingKeys = new Set<string>();
  const validateMessages = (
    primaryMessages: TranslationType,
    messages: TranslationType,
    path: string,
  ) => {
    for (const key of Object.keys(primaryMessages)) {
      const value = primaryMessages[key];
      if (typeof value === "object") {
        validateMessages(
          value,
          messages[key] as TranslationType,
          `${path}.${key}`,
        );
      } else if (!messages[key]) {
        missingKeys.add(`${path}.${key}`);
      }
    }
  };
  validateMessages(primaryLocaleMessages, localeMessages, "");

  if (missingKeys.size > 0) {
    console.error(`Missing keys for locale ${locale}:`);
    for (const key of missingKeys) {
      console.error(`- ${key}`);
    }
    process.exit(1);
  }

  console.log(`Locale ${locale} is valid`);
};
const validateLocales = () => {
  const locales = fs.readdirSync(translationsFolder).filter((file) => {
    return file.endsWith(".json") && file !== `${primaryLocale}.json`;
  });

  for (const locale of locales) {
    validateLocale(locale);
  }

  console.log("All locales are valid");
};
