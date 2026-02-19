import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";

export const metadata: Metadata = {
  title: "Polityka prywatności - Fanatic Speed Team",
  description: "Zasady przetwarzania danych osobowych w ramach wydarzenia.",
  alternates: { canonical: "/polityka-prywatnosci" }
};

export default function PrivacyPolicyPage() {
  return (
    <Stack gap={3}>
      <h1>Polityka prywatności</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Dane osobowe przekazane w formularzach są przetwarzane wyłącznie na potrzeby organizacji wydarzenia
            Fanatic Summer Car Show oraz kontaktu z uczestnikami.
          </p>
          <p>
            Administratorem danych jest Stowarzyszenie Fanatic Speed Team. Dane nie są sprzedawane podmiotom
            trzecim i są przechowywane przez okres niezbędny do realizacji celów organizacyjnych.
          </p>
          <p>
            Użytkownik ma prawo do wglądu, poprawiania oraz żądania usunięcia swoich danych, kontaktując się
            przez zakładkę Pomoc i kontakt.
          </p>
        </CardBody>
      </Card>
    </Stack>
  );
}
