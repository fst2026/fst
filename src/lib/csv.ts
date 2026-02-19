import { VehicleSubmission } from "@/lib/types";

function escapeCsv(value: string) {
  const normalized = value.replace(/\r/g, "");
  const isFormulaLike = /^[=+\-@]/.test(normalized) || /^[\t]/.test(normalized);
  const safeValue = isFormulaLike ? `'${normalized}` : normalized;

  if (safeValue.includes(",") || safeValue.includes('"') || safeValue.includes("\n")) {
    return `"${safeValue.replace(/"/g, '""')}"`;
  }
  return safeValue;
}

export function toSubmissionCsv(submissions: VehicleSubmission[]) {
  const headers = [
    "id",
    "status",
    "createdAt",
    "brand",
    "model",
    "productionYear",
    "registrationNumber",
    "modifications",
    "firstName",
    "lastName",
    "email",
    "phone",
    "instagram",
    "tshirtSize",
    "photoPaths"
  ];

  const rows = submissions.map((item) =>
    [
      item.id,
      item.status,
      item.createdAt,
      item.brand,
      item.model,
      item.productionYear,
      item.registrationNumber,
      item.modifications,
      item.firstName,
      item.lastName,
      item.email,
      item.phone,
      item.instagram,
      item.tshirtSize,
      item.photoPaths.join(" | ")
    ]
      .map((value) => escapeCsv(String(value)))
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
