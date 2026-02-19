import pg from "pg";

const { Pool } = pg;

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
