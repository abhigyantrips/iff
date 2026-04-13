import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import type { Kysely } from "kysely";
import type { Database } from "./db";

export function createAuth(db: Kysely<Database>, env: {
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  ALLOWED_EMAILS: string;
}) {
  const allowedEmails = env.ALLOWED_EMAILS
    .split(",")
    .map((email) => email.trim().toLowerCase());

  return betterAuth({
    database: kyselyAdapter(db, {
      type: "sqlite",
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, _context) => {
            const email = user.email.toLowerCase();
            if (!allowedEmails.includes(email)) {
              throw new Error("Email not allowed. Contact administrator for access.");
            }
            return { data: user };
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
