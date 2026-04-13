/// <reference types="astro/client" />

interface Session {
  session: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

declare namespace App {
  interface Locals {
    session?: Session;
  }
}
