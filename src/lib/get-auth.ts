import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { createDb } from "./db";
import { createAuth } from "./auth";

export function getAuth() {
  const db = createDb(env.DB);
  
  return createAuth(db, {
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    ALLOWED_EMAILS: env.ALLOWED_EMAILS,
  });
}

export async function getSession(context: APIContext) {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  return session;
}

export async function requireAuth(context: APIContext) {
  const session = await getSession(context);
  if (!session) {
    return context.redirect("/api/auth/signin/google");
  }
  return session;
}
