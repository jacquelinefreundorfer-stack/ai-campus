import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }
const sql = neon(DATABASE_URL);

async function run() {
  const steps = [
    // Step 1: Find and drop all FK constraints on enrollments & certificates
    { label: "Drop all FK constraints on enrollments", 
      sql: `DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT conname FROM pg_constraint WHERE contype='f' AND conrelid='enrollments'::regclass) LOOP EXECUTE 'ALTER TABLE enrollments DROP CONSTRAINT ' || quote_ident(r.conname); END LOOP; END $$;` },
    { label: "Drop all FK constraints on certificates", 
      sql: `DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT conname FROM pg_constraint WHERE contype='f' AND conrelid='certificates'::regclass) LOOP EXECUTE 'ALTER TABLE certificates DROP CONSTRAINT ' || quote_ident(r.conname); END LOOP; END $$;` },
    
    // Step 2: Add Better Auth columns to users
    { label: "Add email_verified column", sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false` },
    { label: "Add image column", sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT` },
    { label: "Add updated_at column", sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT now()` },
    
    // Step 3: Change users.id from serial to text
    { label: "Drop default on users.id", sql: `ALTER TABLE users ALTER COLUMN id DROP DEFAULT` },
    { label: "Change users.id type to text", sql: `ALTER TABLE users ALTER COLUMN id TYPE text USING id::text` },
    
    // Step 4: Change FK columns to text
    { label: "Change enrollments.user_id to text", sql: `ALTER TABLE enrollments ALTER COLUMN user_id TYPE text USING user_id::text` },
    { label: "Change certificates.user_id to text", sql: `ALTER TABLE certificates ALTER COLUMN user_id TYPE text USING user_id::text` },
    
    // Step 5: Create Better Auth tables
    { label: "Create session table", sql: `CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT NOT NULL UNIQUE, expires_at TIMESTAMP NOT NULL, ip_address TEXT, user_agent TEXT, created_at TIMESTAMP DEFAULT now(), updated_at TIMESTAMP DEFAULT now())` },
    { label: "Create account table", sql: `CREATE TABLE IF NOT EXISTS account (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, account_id TEXT NOT NULL, provider_id TEXT NOT NULL, access_token TEXT, refresh_token TEXT, access_token_expires_at TIMESTAMP, refresh_token_expires_at TIMESTAMP, scope TEXT, id_token TEXT, password TEXT, created_at TIMESTAMP DEFAULT now(), updated_at TIMESTAMP DEFAULT now())` },
    { label: "Create verification table", sql: `CREATE TABLE IF NOT EXISTS verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expires_at TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT now(), updated_at TIMESTAMP DEFAULT now())` },
    
    // Step 6: Re-add FK constraints
    { label: "Add FK enrollments.user_id -> users.id", sql: `ALTER TABLE enrollments ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)` },
    { label: "Add FK certificates.user_id -> users.id", sql: `ALTER TABLE certificates ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)` },
    { label: "Add FK session.user_id -> users.id", sql: `ALTER TABLE session ADD CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)` },
    { label: "Add FK account.user_id -> users.id", sql: `ALTER TABLE account ADD CONSTRAINT account_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)` },
    { label: "Add FK enrollments.bundle_id -> bundles.id", sql: `ALTER TABLE enrollments ADD CONSTRAINT enrollments_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES bundles(id)` },
    { label: "Add FK certificates.bundle_id -> bundles.id", sql: `ALTER TABLE certificates ADD CONSTRAINT certificates_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES bundles(id)` },
    { label: "Add FK certificates.enrollment_id -> enrollments.id", sql: `ALTER TABLE certificates ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)` },
  ];

  let ok = 0, fail = 0;
  for (const step of steps) {
    try {
      await sql.query(step.sql);
      console.log(`✓ ${step.label}`);
      ok++;
    } catch (e: any) {
      const msg = e.message || "";
      if (msg.includes("already exists") || msg.includes("does not exist") || msg.includes("multiple primary keys")) {
        console.log(`⚠ ${step.label} — ${msg.substring(0, 80)} (likely already applied)`);
      } else {
        console.log(`✗ ${step.label} — ${msg.substring(0, 120)}`);
        fail++;
      }
    }
  }
  
  console.log(`\nDone: ${ok} OK, ${fail} failed, ${steps.length - ok - fail} skipped`);
}

run().then(() => process.exit(0)).catch((e) => { console.error("Fatal:", e); process.exit(1); });
