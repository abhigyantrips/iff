import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getSession } from "@/lib/get-auth";
import { createDb } from "@/lib/db";
import { getCampaignBySlug, updateCampaign, deleteCampaign } from "@/lib/campaigns";
import { z } from "zod";

const recipientSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

const campaignSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  emailTo: z.array(recipientSchema).min(1),
  emailCc: z.array(recipientSchema).optional().default([]),
  emailBcc: z.array(recipientSchema).optional().default([]),
  content: z.string().min(1),
});

export const GET: APIRoute = async (context) => {
  const slug = context.params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = createDb(env.DB);
    const campaign = await getCampaignBySlug(db, slug);

    if (!campaign) {
      return new Response(JSON.stringify({ error: "Campaign not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(campaign), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch campaign" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const PUT: APIRoute = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = context.params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await context.request.json();
    const data = campaignSchema.parse(body);

    const db = createDb(env.DB);
    const campaign = await updateCampaign(db, slug, data);

    return new Response(JSON.stringify({ slug: campaign.slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update campaign:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid data", details: error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to update campaign" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const DELETE: APIRoute = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = context.params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = createDb(env.DB);
    await deleteCampaign(db, slug);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete campaign:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to delete campaign" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
