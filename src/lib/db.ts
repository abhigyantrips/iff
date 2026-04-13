import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: number;
  image: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SessionTable {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AccountTable {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface Recipient {
  name: string;
  email: string;
}

export interface CampaignTable {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  lastDate: number | null;
  emailTo: string;
  emailCc: string;
  emailBcc: string;
  createdAt: number;
  updatedAt: number;
}

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  campaign: CampaignTable;
}

export function createDb(d1: D1Database) {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: d1 }),
  });
}
