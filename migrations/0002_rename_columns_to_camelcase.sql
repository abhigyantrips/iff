-- Migrate column names from snake_case to camelCase
-- SQLite doesn't support ALTER COLUMN RENAME, so we recreate the tables

-- Drop old indexes
DROP INDEX IF EXISTS idx_session_user_id;
DROP INDEX IF EXISTS idx_session_token;
DROP INDEX IF EXISTS idx_account_user_id;
DROP INDEX IF EXISTS idx_account_provider;
DROP INDEX IF EXISTS idx_verification_identifier;

-- Recreate user table
CREATE TABLE user_new (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO user_new (id, name, email, emailVerified, image, createdAt, updatedAt)
SELECT id, name, email, email_verified, image, created_at, updated_at FROM user;

DROP TABLE user;
ALTER TABLE user_new RENAME TO user;

-- Recreate session table
CREATE TABLE session_new (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expiresAt INTEGER NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO session_new (id, userId, token, expiresAt, ipAddress, userAgent, createdAt, updatedAt)
SELECT id, user_id, token, expires_at, ip_address, user_agent, created_at, updated_at FROM session;

DROP TABLE session;
ALTER TABLE session_new RENAME TO session;

-- Recreate account table
CREATE TABLE account_new (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt INTEGER,
    refreshTokenExpiresAt INTEGER,
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO account_new (id, userId, accountId, providerId, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, idToken, password, createdAt, updatedAt)
SELECT id, user_id, account_id, provider_id, access_token, refresh_token, access_token_expires_at, refresh_token_expires_at, scope, id_token, password, created_at, updated_at FROM account;

DROP TABLE account;
ALTER TABLE account_new RENAME TO account;

-- Recreate verification table
CREATE TABLE verification_new (
    id TEXT PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO verification_new (id, identifier, value, expiresAt, createdAt, updatedAt)
SELECT id, identifier, value, expires_at, created_at, updated_at FROM verification;

DROP TABLE verification;
ALTER TABLE verification_new RENAME TO verification;

-- Recreate indexes with new column names
CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
CREATE INDEX IF NOT EXISTS idx_account_provider ON account(providerId, accountId);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
