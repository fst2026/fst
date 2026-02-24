import type { Metadata } from "next";
import { Button, Card, CardBody, Stack } from "react-bootstrap";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Pomoc i kontakt - Fanatic Speed Team",
  description: "Kontakt z organizatorem wydarzenia.",
  alternates: { canonical: "/kontakt" }
};

const FALLBACK_EMAIL = "kontakt.fanaticspeedteam@gmail.com";

export default async function ContactPage() {
  const settings = await getCachedSettings();
  const contactEmail = settings.associationContactEmail || FALLBACK_EMAIL;

  return (
    <Stack gap={3}>
      <h1>Pomoc i kontakt</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <p>
            Masz pytania dotyczące wydarzenia lub potrzebujesz pomocy? Skontaktuj się z nami mailowo.
          </p>
          <p>
            Chcesz pomóc przy organizacji eventu? Napisz do nas z tematem wiadomości: <strong>Zostań wspierającym</strong>.
          </p>
          <Button as="a" href={`mailto:${contactEmail}`} className="align-self-start">
            Napisz do nas
          </Button>
        </CardBody>
      </Card>
    </Stack>
  );
}
