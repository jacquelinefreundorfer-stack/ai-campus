import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }
const sql = neon(DATABASE_URL);

async function run() {
  // 1. Find all FK constraints on enrollments and certificates
  console.log("=== Finding constraint names ===");
  
  const fkQuery = `
    SELECT conname, conrelid::regclass AS table_name 
    FROM pg_constraint 
    WHERE contype = 'f' 
    AND conrelid::regclass::text IN ('enrollments', 'certificates')
    ORDER BY conname
  `;
  
  try {
    const result = await sql.query(fkQuery);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (e: any) {
    console.log("Query failed:", e.message);
    
    // Try a simpler query
    const simple = await sql.query("SELECT conname FROM pg_constraint WHERE contype = 'f'");
    console.log("Simple:", JSON.stringify(simple, null, 2));
  }
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
