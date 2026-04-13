import type { APIRoute } from "astro";
import { getAuth } from "@/lib/get-auth";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const auth = getAuth();
  return auth.handler(context.request);
};
