import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — connect a database before running queries.",
    );
  }
  return url;
}

let _db: ReturnType<typeof drizzle> | null = null;

export function db() {
  if (!_db) {
    const sql = neon(getDbUrl());
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export * from "./schema";
