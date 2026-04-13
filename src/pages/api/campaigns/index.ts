import { createCampaign, getAllCampaigns } from '@/lib/campaigns';
import { createDb } from '@/lib/db';
import { getSession } from '@/lib/get-auth';
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';

const recipientSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

const campaignSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  lastDate: z.string().optional(),
  emailTo: z.array(recipientSchema).min(1),
  emailCc: z.array(recipientSchema).optional().default([]),
  emailBcc: z.array(recipientSchema).optional().default([]),
  content: z.string().min(1),
});

export const GET: APIRoute = async (context) => {
  try {
    const db = createDb(env.DB);
    const campaigns = await getAllCampaigns(db);

    return new Response(JSON.stringify(campaigns), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch campaigns' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();
    const data = campaignSchema.parse(body);

    const db = createDb(env.DB);
    const campaign = await createCampaign(db, data);

    return new Response(JSON.stringify({ slug: campaign.slug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create campaign:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid data', details: error.issues }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Failed to create campaign' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
