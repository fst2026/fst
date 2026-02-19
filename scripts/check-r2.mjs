import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import nextEnv from "@next/env";
import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

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

const config = {
  endpoint: process.env.R2_ENDPOINT || process.env.S3_ENDPOINT,
  region: process.env.R2_REGION || process.env.S3_REGION,
  bucket: process.env.R2_BUCKET || process.env.S3_BUCKET,
  accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || process.env.S3_PUBLIC_BASE_URL
};

const required = [
  "endpoint",
  "region",
  "bucket",
  "accessKeyId",
  "secretAccessKey",
  "publicBaseUrl"
];

const missing = required.filter((key) => !config[key]);

if (missing.length) {
  console.error("R2/S3 config is incomplete. Missing:", missing.join(", "));
  process.exit(1);
}

const client = new S3Client({
  endpoint: config.endpoint,
  region: config.region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }
});

try {
  await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
  console.log("Bucket access OK:", config.bucket);

  const writeCheck = process.env.R2_CHECK_WRITE === "true";
  if (!writeCheck) {
    console.log("Write test skipped. Set R2_CHECK_WRITE=true to verify PUT/DELETE.");
    process.exit(0);
  }

  const key = `.healthcheck/${Date.now()}-${randomUUID()}.txt`;
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: "healthcheck",
      ContentType: "text/plain"
    })
  );

  const normalizedBase = config.publicBaseUrl.replace(/\/$/, "");
  console.log("Write test OK:", `${normalizedBase}/${key}`);

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  );
  console.log("Delete test OK");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("R2 check failed:", message);
  process.exit(1);
}
