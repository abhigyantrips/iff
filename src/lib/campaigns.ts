import type { Kysely } from 'kysely';
import type { CampaignTable, Database, Recipient } from './db';

export interface CampaignInput {
  title: string;
  description: string;
  content: string;
  lastDate?: string;
  emailTo: Recipient[];
  emailCc?: Recipient[];
  emailBcc?: Recipient[];
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  lastDate: Date | null;
  emailTo: Recipient[];
  emailCc: Recipient[];
  emailBcc: Recipient[];
  createdAt: Date;
  updatedAt: Date;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateId(): string {
  return crypto.randomUUID();
}

function rowToCampaign(row: CampaignTable): Campaign {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    lastDate: row.lastDate ? new Date(row.lastDate * 1000) : null,
    emailTo: JSON.parse(row.emailTo) as Recipient[],
    emailCc: JSON.parse(row.emailCc) as Recipient[],
    emailBcc: JSON.parse(row.emailBcc) as Recipient[],
    createdAt: new Date(row.createdAt * 1000),
    updatedAt: new Date(row.updatedAt * 1000),
  };
}

export async function getAllCampaigns(
  db: Kysely<Database>
): Promise<Campaign[]> {
  const rows = await db
    .selectFrom('campaign')
    .selectAll()
    .orderBy('date', 'desc')
    .execute();

  return rows.map(rowToCampaign);
}

export async function getCampaignBySlug(
  db: Kysely<Database>,
  slug: string
): Promise<Campaign | null> {
  const row = await db
    .selectFrom('campaign')
    .selectAll()
    .where('slug', '=', slug)
    .executeTakeFirst();

  return row ? rowToCampaign(row) : null;
}

export async function getCampaignById(
  db: Kysely<Database>,
  id: string
): Promise<Campaign | null> {
  const row = await db
    .selectFrom('campaign')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return row ? rowToCampaign(row) : null;
}

export async function createCampaign(
  db: Kysely<Database>,
  input: CampaignInput
): Promise<Campaign> {
  const id = generateId();
  const slug = slugify(input.title);
  const now = Math.floor(Date.now() / 1000);
  const lastDateTimestamp = input.lastDate
    ? Math.floor(new Date(input.lastDate).getTime() / 1000)
    : null;

  const existing = await getCampaignBySlug(db, slug);
  if (existing) {
    throw new Error(`Campaign with slug "${slug}" already exists`);
  }

  const row: CampaignTable = {
    id,
    slug,
    title: input.title,
    description: input.description,
    content: input.content,
    lastDate: lastDateTimestamp,
    emailTo: JSON.stringify(input.emailTo),
    emailCc: JSON.stringify(input.emailCc ?? []),
    emailBcc: JSON.stringify(input.emailBcc ?? []),
    createdAt: now,
    updatedAt: now,
  };

  await db.insertInto('campaign').values(row).execute();

  return rowToCampaign(row);
}

export async function updateCampaign(
  db: Kysely<Database>,
  slug: string,
  input: CampaignInput
): Promise<Campaign> {
  const existing = await getCampaignBySlug(db, slug);
  if (!existing) {
    throw new Error(`Campaign not found: ${slug}`);
  }

  const newSlug = slugify(input.title);
  const now = Math.floor(Date.now() / 1000);
  const lastDateTimestamp = input.lastDate
    ? Math.floor(new Date(input.lastDate).getTime() / 1000)
    : null;

  if (newSlug !== slug) {
    const slugConflict = await getCampaignBySlug(db, newSlug);
    if (slugConflict) {
      throw new Error(`Campaign with slug "${newSlug}" already exists`);
    }
  }

  await db
    .updateTable('campaign')
    .set({
      slug: newSlug,
      title: input.title,
      description: input.description,
      content: input.content,
      lastDate: lastDateTimestamp,
      emailTo: JSON.stringify(input.emailTo),
      emailCc: JSON.stringify(input.emailCc ?? []),
      emailBcc: JSON.stringify(input.emailBcc ?? []),
      updatedAt: now,
    })
    .where('id', '=', existing.id)
    .execute();

  const updated = await getCampaignById(db, existing.id);
  if (!updated) {
    throw new Error('Failed to retrieve updated campaign');
  }

  return updated;
}

export async function deleteCampaign(
  db: Kysely<Database>,
  slug: string
): Promise<void> {
  const existing = await getCampaignBySlug(db, slug);
  if (!existing) {
    throw new Error(`Campaign not found: ${slug}`);
  }

  await db.deleteFrom('campaign').where('id', '=', existing.id).execute();
}
