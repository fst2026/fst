import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { ContactForm } from "@/components/ContactForm";
import { ASSOCIATION_DETAILS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pomoc i kontakt - Fanatic Speed Team",
  description: "Kontakt z organizatorem i formularz kontaktowy.",
  alternates: { canonical: "/kontakt" }
};

export default function ContactPage() {
  return (
    <Stack gap={3}>
      <h1>Pomoc i kontakt</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Kontakt:{" "}
            <a href={`mailto:${ASSOCIATION_DETAILS.contactEmail}`}>{ASSOCIATION_DETAILS.contactEmail}</a>
          </p>
          <p>
            Organizator: {ASSOCIATION_DETAILS.name}
            <br />
            Chcesz pomóc przy organizacji eventu? Napisz do nas z tematem wiadomości: Zostań helperem.
          </p>
        </CardBody>
      </Card>
      <ContactForm />
    </Stack>
  );
}
