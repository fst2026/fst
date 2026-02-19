import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { ASSOCIATION_DETAILS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wesprzyj nasze działania - Fanatic Speed Team",
  description: "Informacje o wsparciu i darowiznach dla stowarzyszenia.",
  alternates: { canonical: "/wesprzyj" }
};

export default function SupportPage() {
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
            {ASSOCIATION_DETAILS.name}
            <br />
            {ASSOCIATION_DETAILS.taxId}
          </p>
          <p>
            <strong>Numer konta:</strong>
            <br />
            {ASSOCIATION_DETAILS.accountNumber}
          </p>
        </CardBody>
      </Card>
    </Stack>
  );
}
