import { env } from "@/env.mjs";
import SteamAPI from "steamapi";

const steamApi = new SteamAPI(env.STEAM_API_KEY);

export default steamApi;
