import { defineMiddleware } from "astro:middleware";
import { getSession } from "@/lib/get-auth";

const PROTECTED_PATHS = ["/admin"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const session = await getSession(context);

    if (!session) {
      const callbackUrl = encodeURIComponent(pathname);
      return context.redirect(`/login?callbackUrl=${callbackUrl}`);
    }

    context.locals.session = session;
  }

  return next();
});
