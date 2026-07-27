import { neon } from "@neondatabase/serverless";
import * as fs from "node:fs";
import * as path from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function run() {
  const migrationPath = path.join(import.meta.dirname || __dirname, "..", "src", "db", "migrations", "0002_better_auth.sql");
  const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
  
  console.log("Running migration: 0002_better_auth.sql");
  
  // Split into individual statements, stripping the BEGIN/COMMIT wrapper
  const statements = migrationSQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--") && s !== "BEGIN" && s !== "COMMIT");
  
  for (const stmt of statements) {
    const short = stmt.substring(0, 80).replace(/\n/g, " ");
    try {
      console.log(`Running: ${short}...`);
      await sql.query(stmt);
      console.log("  ✓ OK");
    } catch (e2: any) {
      if (e2.message?.includes("already exists") || e2.message?.includes("does not exist") || e2.message?.includes("duplicate")) {
        console.log(`  ⚠ ${e2.message.substring(0, 100)}`);
      } else {
        console.log(`  ✗ ${e2.message.substring(0, 200)}`);
      }
    }
  }
}

run().then(() => {
  console.log("Done.");
  process.exit(0);
}).catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
