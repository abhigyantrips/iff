-- Migration: Replace required 'date' field with optional 'lastDate' field
-- The date field was metadata for admin purposes; lastDate is an optional deadline

-- Add new lastDate column (nullable)
ALTER TABLE campaign ADD COLUMN lastDate INTEGER;

-- Drop the old date index
DROP INDEX IF EXISTS idx_campaign_date;

-- Create new index for lastDate queries
CREATE INDEX IF NOT EXISTS idx_campaign_last_date ON campaign(lastDate DESC);
