import { Redis } from "@upstash/redis";

const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  process.env.VERCEL_KV_REST_URL ||
  process.env.EXPLOREYOURROUTE_KV_REST_API_URL ||
  process.env.exploreyourroute_KV_REST_API_URL;

const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.VERCEL_KV_REST_TOKEN ||
  process.env.EXPLOREYOURROUTE_KV_REST_API_TOKEN ||
  process.env.exploreyourroute_KV_REST_API_TOKEN;

if (!url) {
  throw new Error(
    "Missing Upstash REST URL. Set UPSTASH_REDIS_REST_URL or one of the equivalent KV REST URL variables."
  );
}

export const redis = new Redis({
  url,
  token,
  enableTelemetry: false,
});
