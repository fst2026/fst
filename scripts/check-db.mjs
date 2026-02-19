import pg from "pg";
import { existsSync, readFileSync } from "node:fs";
import nextEnv from "@next/env";

const { Pool } = pg;
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function hydrateEnvFromLocalFile() {
  const file = ".env.local";
  if (!existsSync(file)) return;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!key) continue;
    if (!process.env[key] || process.env[key]?.trim() === "") {
      process.env[key] = value;
    }
  }
}

hydrateEnvFromLocalFile();

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: url
});

try {
  const result = await pool.query("SELECT 1 AS ok");
  if (result.rows[0]?.ok === 1) {
    console.log("Database connection OK");
  } else {
    console.error("Database connection failed");
    process.exit(1);
  }
} finally {
  await pool.end();
}
