import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Wesprzyj nasze działania - Fanatic Speed Team",
  description: "Informacje o wsparciu i darowiznach dla stowarzyszenia.",
  alternates: { canonical: "/wesprzyj" }
};

export default async function SupportPage() {
  const settings = await getCachedSettings();

  return (
    <Stack gap={3}>
      <h1>Wesprzyj nasze działania</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Możesz wesprzeć rozwój wydarzeń i działalność stowarzyszenia poprzez darowiznę. Każde wsparcie
            przeznaczamy na organizację eventów, infrastrukturę i działania społeczne.
          </p>
          <p>
            <strong>Dane stowarzyszenia:</strong>
            <br />
            {settings.associationName}
            <br />
            {settings.associationTaxId}
          </p>
          <p>
            <strong>Numer konta:</strong>
            <br />
            {settings.associationAccountNumber}
          </p>
          <p>
            <strong>Dane do wpłaty:</strong>
            <br />
            Odbiorca: {settings.paymentRecipientName}
            <br />
            Konto: {settings.paymentBankAccount}
            <br />
            Termin: {settings.paymentDeadlineText}
          </p>
        </CardBody>
      </Card>
    </Stack>
  );
}
