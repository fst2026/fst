import pg from "pg";
import { SiteSettings, VehicleSubmission } from "@/lib/types";

type QueryResultRow = Record<string, unknown>;
type DbQueryResult = { rows: QueryResultRow[] };
type DbPool = {
  query: (sql: string, params?: unknown[]) => Promise<DbQueryResult>;
};

const { Pool } = pg as unknown as { Pool: new (...args: unknown[]) => DbPool };

const DATABASE_URL = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as { pool?: DbPool; schemaInit?: Promise<void> };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: DATABASE_URL || "postgresql://invalid:invalid@localhost:5432/invalid"
  });

if (!globalForDb.pool) globalForDb.pool = pool;

const schemaSql = `
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  production_year TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  modifications TEXT NOT NULL,
  photo_paths JSONB NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT NOT NULL,
  tshirt_size TEXT NOT NULL,
  accepted_rules BOOLEAN NOT NULL,
  accepted_rodo BOOLEAN NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_changed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT NOT NULL,
  window_start BIGINT NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (key, window_start)
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id, settings) VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
`;

async function ensureSchema() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }
  await pool.query(schemaSql);
}

export async function dbReady() {
  globalForDb.schemaInit = globalForDb.schemaInit ?? ensureSchema();
  await globalForDb.schemaInit;
}

function mapSubmission(row: Record<string, unknown>): VehicleSubmission {
  return {
    id: String(row.id),
    brand: String(row.brand),
    model: String(row.model),
    productionYear: String(row.production_year),
    registrationNumber: String(row.registration_number),
    modifications: String(row.modifications),
    photoPaths: Array.isArray(row.photo_paths)
      ? (row.photo_paths as string[])
      : typeof row.photo_paths === "string"
        ? (JSON.parse(row.photo_paths) as string[])
        : [],
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    email: String(row.email),
    phone: String(row.phone),
    instagram: String(row.instagram),
    tshirtSize: String(row.tshirt_size),
    acceptedRules: Boolean(row.accepted_rules),
    acceptedRodo: Boolean(row.accepted_rodo),
    status: row.status as VehicleSubmission["status"],
    createdAt: new Date(String(row.created_at)).toISOString()
  };
}

export async function createSubmission(submission: VehicleSubmission) {
  await dbReady();
  await pool.query(
    `INSERT INTO submissions (
      id, brand, model, production_year, registration_number, modifications, photo_paths,
      first_name, last_name, email, phone, instagram, tshirt_size,
      accepted_rules, accepted_rodo, status, created_at, updated_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7::jsonb,
      $8,$9,$10,$11,$12,$13,
      $14,$15,$16,$17,$18
    )`,
    [
      submission.id,
      submission.brand,
      submission.model,
      submission.productionYear,
      submission.registrationNumber,
      submission.modifications,
      JSON.stringify(submission.photoPaths),
      submission.firstName,
      submission.lastName,
      submission.email,
      submission.phone,
      submission.instagram,
      submission.tshirtSize,
      submission.acceptedRules,
      submission.acceptedRodo,
      submission.status,
      submission.createdAt,
      submission.createdAt
    ]
  );
}

export async function getSubmissions() {
  await dbReady();
  const result = await pool.query("SELECT * FROM submissions ORDER BY created_at DESC");
  return result.rows.map((row: Record<string, unknown>) => mapSubmission(row));
}

export async function getSubmissionById(id: string) {
  await dbReady();
  const result = await pool.query("SELECT * FROM submissions WHERE id = $1 LIMIT 1", [id]);
  if (!result.rows[0]) return null;
  return mapSubmission(result.rows[0]);
}

export async function updateSubmissionStatus(id: string, status: "accepted" | "rejected") {
  await dbReady();
  const result = await pool.query(
    `UPDATE submissions
       SET status = $1, updated_at = NOW(), status_changed_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  if (!result.rows[0]) return null;
  return mapSubmission(result.rows[0]);
}

export async function createContactRequest(input: {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}) {
  await dbReady();
  await pool.query(
    `INSERT INTO contact_requests (id, name, email, message, created_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [input.id, input.name, input.email, input.message, input.createdAt]
  );
}

export async function incrementRateLimit(key: string, windowStart: number) {
  await dbReady();
  const result = await pool.query(
    `INSERT INTO rate_limits (key, window_start, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (key, window_start)
     DO UPDATE SET count = rate_limits.count + 1
     RETURNING count`,
    [key, windowStart]
  );
  return Number(result.rows[0]?.count ?? 1);
}

const defaultSettings: SiteSettings = {
  eventName: "Fanatic Summer Car Show",
  eventDate: "2026-07-20",
  eventLocation: "Teren rekreacyjny FanaticSpeedTeam, woj. pomorskie",
  facebookEventUrl: "https://facebook.com",
  galleryDropboxUrl: "https://www.dropbox.com/sh/example",
  socialFacebook: "https://facebook.com/fanaticspeedteam",
  socialInstagram: "https://instagram.com/fanaticspeedteam",
  socialTiktok: "https://tiktok.com/@fanaticspeedteam",
  associationName: "Stowarzyszenie Fanatic Speed Team",
  associationAccountNumber: "00 0000 0000 0000 0000 0000 0000",
  associationTaxId: "NIP: 000-000-00-00",
  associationContactEmail: "fanaticspeedteam@gmail.com",
  entryFeePln: 150,
  paymentRecipientName: "Stowarzyszenie Fanatic Speed Team",
  paymentBankAccount: "00 0000 0000 0000 0000 0000 0000",
  paymentDeadlineText: "w ciągu 72 godzin od otrzymania tej wiadomości",
  parkingMapUrl: "https://maps.google.com/?q=Gda%C5%84sk"
};

export async function getSettings(): Promise<SiteSettings> {
  await dbReady();
  const result = await pool.query("SELECT settings FROM site_settings WHERE id = 1");
  const stored = (result.rows[0]?.settings as Partial<SiteSettings>) ?? {};
  return { ...defaultSettings, ...stored };
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  await dbReady();
  const result = await pool.query(
    `UPDATE site_settings
     SET settings = settings || $1::jsonb, updated_at = NOW()
     WHERE id = 1
     RETURNING settings`,
    [JSON.stringify(partial)]
  );
  const stored = (result.rows[0]?.settings as Partial<SiteSettings>) ?? {};
  return { ...defaultSettings, ...stored };
}
