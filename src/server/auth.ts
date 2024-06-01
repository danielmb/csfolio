/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { SteamProvider, steamProviderId } from "@/providers/SteamProvider";
import type { NextRequest } from "next/server";
import steamApi from "@/lib/steam";

const urlIfiy = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("localhost")) {
    return `http://${url}`;
  }
  return `https://${url}`;
};

const nextAuthUrl = urlIfiy(env.NEXTAUTH_URL);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      steamId: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  callbacks: {
    // session: ({ session, user }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id,
    //   },
    // }),
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          steamId: user.email?.split("@")[0] ?? "",
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    SteamProvider({
      nextAuthUrl: `${env.NEXTAUTH_URL}/api/auth/callback`,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export const authOptionsWithRequest = (req?: NextRequest): NextAuthOptions => ({
  ...authOptions,
  providers: [
    ...authOptions.providers.filter(
      (provider) => provider.id !== steamProviderId,
    ),
    SteamProvider(
      {
        // nextAuthUrl: `${env.NEXTAUTH_URL}/api/auth/callback`,
        nextAuthUrl: `${nextAuthUrl}/api/auth/callback`,
        steamApiKey: env.STEAM_API_KEY,
      },
      req,
    ),
  ],
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
