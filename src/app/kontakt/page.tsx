import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { ContactForm } from "@/components/ContactForm";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Pomoc i kontakt - Fanatic Speed Team",
  description: "Kontakt z organizatorem i formularz kontaktowy.",
  alternates: { canonical: "/kontakt" }
};

export default async function ContactPage() {
  const settings = await getCachedSettings();

  return (
    <Stack gap={3}>
      <h1>Pomoc i kontakt</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Kontakt:{" "}
            <a href={`mailto:${settings.associationContactEmail}`}>{settings.associationContactEmail}</a>
          </p>
          <p>
            Organizator: {settings.associationName}
            <br />
            Chcesz pomóc przy organizacji eventu? Napisz do nas z tematem wiadomości: Zostań helperem.
          </p>
        </CardBody>
      </Card>
      <ContactForm />
    </Stack>
  );
}
