import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Wesprzyj nasze działania - Fanatic Speed Team",
  description: "Informacje o wsparciu i darowiznach dla stowarzyszenia.",
  alternates: { canonical: "/wesprzyj" }
};

const FALLBACK = {
  accountNumber: "41 8909 0006 0010 0019 6699 0001",
  taxId: "7561999499"
};

export default async function SupportPage() {
  const settings = await getCachedSettings();
  const accountNumber = settings.associationAccountNumber || FALLBACK.accountNumber;
  const taxId = settings.associationTaxId || FALLBACK.taxId;

  return (
    <Stack gap={3}>
      <h1>Wesprzyj nasze działania</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-3">
          <p>
            Możesz wesprzeć rozwój wydarzeń i działalność stowarzyszenia poprzez darowiznę. Każde wsparcie
            przeznaczamy na organizację eventów, infrastrukturę i działania społeczne.
          </p>
          <div>
            <strong>Numer konta:</strong>
            <br />
            <span style={{ fontFamily: "monospace", fontSize: "1.1rem" }}>
              {accountNumber}
            </span>
          </div>
          <div>
            <strong>NIP:</strong>
            <br />
            {taxId}
          </div>
        </CardBody>
      </Card>
    </Stack>
  );
}
