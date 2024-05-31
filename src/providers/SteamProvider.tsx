/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { randomUUID as uuidv4 } from "crypto";
import type { NextApiRequest } from "next";
import type { Profile } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import type { NextRequest } from "next/server";
import {
  type BaseClient,
  type TokenSetParameters,
  TokenSet,
} from "openid-client";
import { type SteamPlayerSummariesResponse } from "./steam-provider.types";

export const steamProviderId = "steam";

export const steamProviderName = "Steam";

export const steamEmailDomain = "steamcommunity.com";

export interface SteamProfile extends Record<string, string | number> {
  /**
   * The Steam ID of the user.
   */
  providerAccountId: string;
  /**
   * The current provider
   */
  provider: string;
  /**
   * The token id as random uuid4
   */
  id_token: string;
  /**
   * The access token which is dummy as random uuid4
   */
  access_token: string;
}

export type onUserInfoRequestContext = {
  tokens: TokenSetParameters;
} & {
  client: BaseClient;
  provider: OAuthConfig<SteamProfile> & {
    signinUrl: string;
    callbackUrl: string;
  };
};

/**
 * Represents the additional configuration options required for the Steam provider.
 *
 * @extends OAuthUserConfig<SteamProfile>
 */
export interface SteamProviderOptions
  extends Omit<OAuthUserConfig<SteamProfile>, "clientId" | "clientSecret"> {
  nextAuthUrl?: string;
  onUserInfoRequest?: (ctx: onUserInfoRequestContext) => Promise<object>;
  steamApiKey?: string;
}

export const SteamProvider = (
  providerOptions: SteamProviderOptions,
  request?: NextApiRequest | NextRequest,
) => {
  const {
    nextAuthUrl = "http://localhost:3000/api/auth/callback",
    onUserInfoRequest = async () => {
      return {};
    },
    ...options
  } = providerOptions;

  const callbackUrl = new URL(nextAuthUrl);

  const realm = callbackUrl.origin;
  const returnTo = `${callbackUrl.href}/${steamProviderId}`;
  return {
    options: {
      ...options,
    } as OAuthUserConfig<SteamProfile>,
    id: steamProviderId,
    name: steamProviderName,
    type: "oauth",
    style: getProviderStyle(),
    idToken: false,
    checks: ["none"],
    clientId: steamProviderId,
    authorization: getAuthorizationParams(returnTo, realm),
    token: {
      async request() {
        try {
          if (!request?.url) {
            throw new Error(
              "No request URL provided. You will require to pass `request` of any type NextApiRequest or NextRequest, when you need to use `token.request()`. Generally this on SignIn page for outdated openId on Steam.",
            );
          }

          const claimedIdentifier = await verifyAssertion(request.url);

          if (!claimedIdentifier) throw new Error("Unauthenticated");

          const steamId = extractSteamId(claimedIdentifier);

          if (!steamId) throw new Error("Unauthenticated");

          return {
            tokens: new TokenSet({
              id_token: uuidv4(),
              access_token: uuidv4(),
              providerAccountId: steamId,
              provider: steamProviderId,
            }),
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    },
    userinfo: {
      async request(ctx: onUserInfoRequestContext) {
        try {
          const data = await onUserInfoRequest(ctx);

          if (typeof data !== "object") {
            throw new Error(
              "Something went wrong on onUserInfoRequest, make sure you're returning an object",
              data,
            );
          }

          return {
            providerAccountId: ctx.tokens.providerAccountId as string,
            provider: steamProviderId,
            ...data,
          } as Profile;
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    },
    async profile(profile: SteamProfile) {
      // const response = await fetch(
      //   `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${providerOptions.steamApiKey}&steamids=${profile.providerAccountId}`,
      // );
      // const data = (await response.json()) as SteamPlayerSummariesResponse;
      // const player = data.response.players[0];
      let name = "";
      let image = "";
      if (providerOptions.steamApiKey && profile.providerAccountId) {
        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${providerOptions.steamApiKey}&steamids=${profile.providerAccountId}`,
        );
        const data = (await response.json()) as SteamPlayerSummariesResponse;
        const player = data.response.players[0];
        name = player?.personaname ?? "";
        image = player?.avatarfull ?? "";
      }
      return {
        id: profile.providerAccountId,
        email: `${profile.providerAccountId}@${steamEmailDomain}`,
        name,
        image,
        steamId: profile.providerAccountId,
      };
    },
  } satisfies OAuthConfig<SteamProfile>;
};

/**
 * Provides the styling options for the Steam provider's buttons and UI elements.
 *
 * @returns {Object} The style configuration object.
 */
const getProviderStyle = () => ({
  logo: "https://raw.githubusercontent.com/HyperPlay-Gaming/next-auth-steam/b65dc09e98cead3111ecbfaa0ecc15eab7f125d9/logo/steam.svg",
  logoDark:
    "https://raw.githubusercontent.com/HyperPlay-Gaming/next-auth-steam/b65dc09e98cead3111ecbfaa0ecc15eab7f125d9/logo/steam-dark.svg",
  bg: "#121212",
  text: "#fff",
  bgDark: "#000",
  textDark: "#fff",
});

/**
 * Returns the authorization parameters for the Steam OpenID connection.
 *
 * @param {string} returnTo - The URL to which Steam will return after authentication.
 * @param {string} realm - The realm under which the OpenID authentication is performed.
 * @returns {Object} The authorization parameters object.
 */
const getAuthorizationParams = (returnTo: string, realm: string) => ({
  url: "https://steamcommunity.com/openid/login",
  params: {
    "openid.mode": "checkid_setup",
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.return_to": returnTo,
    "openid.realm": realm,
  },
});

/**
 * Verifies the OpenID authentication assertion.
 *
 * @param {string} url - The URL to which the OpenID provider has sent the assertion response.
 * @returns {Promise<string|null>} A promise that resolves with the claimed identifier if authenticated, or null otherwise.
 */
async function verifyAssertion(url: string): Promise<string | null> {
  if (!url) return null;

  const { searchParams } = new URL(url);
  const signed = searchParams.get("openid.signed") ?? "";
  const token_params: Record<string, string> = {};

  for (const val of signed.split(",")) {
    token_params[`openid.${val}`] = searchParams.get(`openid.${val}`) ?? "";
  }

  const token_url = new URL("https://steamcommunity.com/openid/login");
  const token_url_params = new URLSearchParams({
    "openid.assoc_handle": searchParams.get("openid.assoc_handle") ?? "",
    "openid.signed": signed,
    "openid.sig": searchParams.get("openid.sig") ?? "",
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "check_authentication",
    ...token_params,
  });

  token_url.search = token_url_params.toString();

  const token_res = await fetch(token_url, {
    method: "POST",
    headers: {
      "Accept-language": "en",
      "Content-type": "application/x-www-form-urlencoded",
      "Content-Length": `${token_url_params.toString().length}`,
    },
    body: token_url_params.toString(),
  });

  const result = await token_res.text();

  if (result.match(/is_valid\s*:\s*true/i)) {
    return token_url_params.get("openid.claimed_id");
  }

  return null;
}

/**
 * Extracts the Steam ID from the claimed identifier URL.
 *
 * @param {string} claimedIdentifier - The claimed identifier URL returned from Steam OpenID.
 * @returns {string|null} The extracted Steam ID or null if not found.
 */
const extractSteamId = (claimedIdentifier: string): string | null => {
  const matches = claimedIdentifier.match(
    /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/,
  );
  return matches ? matches[1] ?? null : null;
};
