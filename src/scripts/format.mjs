import { execSync } from "child_process";

const i18nFormat = () => {
  execSync(
    `npm run extract -- "src/**/*.tsx" --out-file src/i18n/extracted/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'`,
    { stdio: "inherit" },
  );
  execSync(
    `npm run compile -- "src/i18n/extracted/en.json" --ast --out-file src/i18n/locales/en.json`,
    {
      stdio: "inherit",
    },
  );
};

i18nFormat();
