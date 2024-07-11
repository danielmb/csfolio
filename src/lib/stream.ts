// upstash
import { env } from "@/env.mjs";
import { Redis as RedisEdge } from "@upstash/redis";
import Redis from "ioredis";

export const redisEdge = RedisEdge.fromEnv();

// export const redis = new Redis(env.UPSTASH_REDIS_URL);

export class RedisStream {
  public redis: Redis;
  constructor() {
    this.redis = new Redis(env.UPSTASH_REDIS_URL);
  }
}
