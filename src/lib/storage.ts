import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const s3Config = {
  endpoint: process.env.R2_ENDPOINT || process.env.S3_ENDPOINT,
  region: process.env.R2_REGION || process.env.S3_REGION,
  bucket: process.env.R2_BUCKET || process.env.S3_BUCKET,
  key: process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
  secret: process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || process.env.S3_PUBLIC_BASE_URL
};

function hasS3Config() {
  return Boolean(
    s3Config.endpoint &&
      s3Config.region &&
      s3Config.bucket &&
      s3Config.key &&
      s3Config.secret &&
      s3Config.publicBaseUrl
  );
}

let s3Client: S3Client | null = null;

export type DetectedImage = {
  buffer: Buffer;
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function getS3Client() {
  if (!hasS3Config()) return null;
  if (s3Client) return s3Client;

  s3Client = new S3Client({
    endpoint: s3Config.endpoint,
    region: s3Config.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: s3Config.key!,
      secretAccessKey: s3Config.secret!
    }
  });
  return s3Client;
}

function detectImageType(buffer: Buffer): DetectedImage["extension"] | null {
  if (buffer.length < 12) return null;

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }
  // WEBP (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

function mapExtensionToMime(extension: DetectedImage["extension"]): DetectedImage["mimeType"] {
  if (extension === "jpg") return "image/jpeg";
  if (extension === "png") return "image/png";
  return "image/webp";
}

export async function normalizeUploadedImage(file: File): Promise<DetectedImage | null> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = detectImageType(buffer);
  if (!extension) return null;

  return {
    buffer,
    extension,
    mimeType: mapExtensionToMime(extension)
  };
}

export async function uploadImageFile(file: DetectedImage) {
  const disableUploads = process.env.DISABLE_IMAGE_UPLOAD === "true";
  if (disableUploads) return "";

  const fileName = `${Date.now()}-${randomUUID()}.${file.extension}`;
  const buffer = file.buffer;

  const s3 = getS3Client();
  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket!,
        Key: fileName,
        Body: buffer,
        ContentType: file.mimeType
      })
    );
    return `${s3Config.publicBaseUrl!.replace(/\/$/, "")}/${fileName}`;
  }

  // Vercel filesystem is ephemeral; without object storage we skip persistent writes.
  if (process.env.VERCEL === "1") {
    return "";
  }

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, fileName), buffer);
  return `/uploads/${fileName}`;
}
