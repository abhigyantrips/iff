import { getAuth } from '@/lib/get-auth';
import type { APIRoute } from 'astro';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const auth = getAuth();
  return auth.handler(context.request);
};
