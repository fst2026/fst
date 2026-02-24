import type { Metadata } from "next";
import { Button, Card, CardBody, Stack } from "react-bootstrap";

export const metadata: Metadata = {
  title: "Zostań wystawcą - Fanatic Summer Car Show",
  description: "Oferta współpracy dla firm podczas wydarzenia motoryzacyjnego.",
  alternates: { canonical: "/zostan-wystawca" }
};

export default function ExhibitorPage() {
  return (
    <Stack gap={3}>
      <h1>Zostań wystawcą</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Zapraszamy firmy do współpracy podczas wydarzenia Fanatic Summer Car Show. Możesz pokazać swoją
            markę i dotrzeć do zaangażowanej społeczności motoryzacyjnej.
          </p>
          <ul>
            <li>Możliwość wystawienia stoiska firmowego.</li>
            <li>Promocja marki podczas eventu i w kanałach social media.</li>
            <li>Przekazanie gadżetów promocyjnych do pakietów startowych.</li>
          </ul>
          <Button as="a" href="mailto:kontakt.fanaticspeedteam@gmail.com" className="align-self-start">
            Nawiąż współpracę
          </Button>
        </CardBody>
      </Card>
    </Stack>
  );
}
