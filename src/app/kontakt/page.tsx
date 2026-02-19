import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Pomoc i kontakt - Fanatic Speed Team",
  description: "Kontakt z organizatorem i formularz kontaktowy.",
  alternates: { canonical: "/kontakt" }
};

const CONTACT_EMAIL = "fanaticspeedteamost@gmail.com";

export default function ContactPage() {
  return (
    <Stack gap={3}>
      <h1>Pomoc i kontakt</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            <strong>E-mail:</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>
            Chcesz pomóc przy organizacji eventu? Napisz do nas z tematem wiadomości: Zostań helperem.
          </p>
        </CardBody>
      </Card>
      <ContactForm />
    </Stack>
  );
}
