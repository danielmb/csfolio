// const { readAndUpload, createSecretUpdater } = require("github-secret-dotenv");
import { createSecretUpdater } from "github-secret-dotenv";
// const fs = require("fs");
import fs from "fs";
// const dotenv = require("dotenv").config({
//   path: "./.env.github-sync",
// });
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";
dotenv.config({
  path: "./.env.github-sync",
});

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is required");
}
if (!process.env.GITHUB_REPOSITORY) {
  throw new Error("GITHUB_REPOSITORY is required");
}
// const config = {
//   owner: process.env.GITHUB_REPOSITORY.split("/")[0],
//   repo: process.env.GITHUB_REPOSITORY.split("/")[1],
//   githubAccessToken: process.env.GITHUB_TOKEN,
//   envFilePath: process.env.ENV_FILE,
// };

const ignore = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return [];
    return val.split(",").map((v) => v.trim());
  })
  .parse(process.env.IGNORE);

const config = z
  .object({
    owner: z.string(),
    repo: z.string(),
    githubAccessToken: z.string(),
    dotEnvFilename: z.string(),
  })
  .parse({
    owner: process.env.GITHUB_REPOSITORY.split("/")[0],
    repo: process.env.GITHUB_REPOSITORY.split("/")[1],
    githubAccessToken: process.env.GITHUB_TOKEN,
    dotEnvFilename: process.env.ENV_FILE,
  });

const main = async () => {
  // await readAndUpload({
  //   ...config,
  // });
  const envRaw = dotenv.parse(fs.readFileSync(config.dotEnvFilename, "utf8"));
  const envExpanded = expand({
    parsed: envRaw,

    ignoreProcessEnv: true,
  }).parsed;

  const env = envExpanded ?? envRaw;

  const secretUpdater = createSecretUpdater({
    githubAccessToken: config.githubAccessToken,
    owner: config.owner,
    repo: config.repo,
  });

  const sshKey = fs.readFileSync("./keys/privateKey", "utf8");
  await secretUpdater("SSH_PRIV_KEY", sshKey);

  for (const [key, value] of Object.entries(env)) {
    if (ignore.includes(key)) {
      console.log(`Ignoring ${key}`);
      continue;
    }
    console.log(`Setting ${key}`);
    await secretUpdater(key, value);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
