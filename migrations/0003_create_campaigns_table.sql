-- Campaigns table for storing email campaigns
-- Replaces markdown content collections with D1 storage

CREATE TABLE IF NOT EXISTS campaign (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    date INTEGER NOT NULL,
    emailTo TEXT NOT NULL, -- JSON array of {name, email} objects
    emailCc TEXT NOT NULL DEFAULT '[]', -- JSON array of {name, email} objects
    emailBcc TEXT NOT NULL DEFAULT '[]', -- JSON array of {name, email} objects
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_campaign_slug ON campaign(slug);
CREATE INDEX IF NOT EXISTS idx_campaign_date ON campaign(date DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_created_at ON campaign(createdAt DESC);
