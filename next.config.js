/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.module.rules.push({
      test: [/node_modules[\\/]react-intl[\\/.].*\.js$/],
      loader: require.resolve("./loaders/use-client-loader.js"),
    });
    return config;
  },
  // allow images from avatars.steamstatic.com
  images: {
    domains: ["avatars.steamstatic.com"],
  },
};

// export default config;
module.exports = config;
