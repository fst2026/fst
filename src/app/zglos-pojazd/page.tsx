import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { SubmissionForm } from "@/components/SubmissionForm";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Zgłoś pojazd - Fanatic Summer Car Show",
  description: "Formularz zgłoszeniowy pojazdu na Fanatic Summer Car Show.",
  alternates: { canonical: "/zglos-pojazd" }
};

const FALLBACK_ENTRY_FEE = 150;
const FALLBACK_TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const FALLBACK_CLOSED_MESSAGE = "Zgłoszenia są obecnie zamknięte. Śledź nasze social media, aby nie przegapić otwarcia zapisów!";

export default async function SubmitCarPage() {
  const settings = await getCachedSettings();

  if (!settings.submissionsOpen) {
    const closedMessage = settings.submissionsClosedMessage || FALLBACK_CLOSED_MESSAGE;
    return (
      <Stack gap={3}>
        <h1>Zgłoś pojazd</h1>
        <Card className="form-card shadow-sm border-0">
          <CardBody className="text-center py-5">
            <h2 className="h4 mb-3">Zgłoszenia zamknięte</h2>
            <p className="text-body-secondary mb-0">{closedMessage}</p>
          </CardBody>
        </Card>
      </Stack>
    );
  }

  const entryFeePln = settings.entryFeePln || FALLBACK_ENTRY_FEE;
  const tshirtSizes = settings.tshirtSizes
    ? settings.tshirtSizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
    : FALLBACK_TSHIRT_SIZES;

  return (
    <Stack gap={3}>
      <h1>Zgłoś pojazd</h1>
      <SubmissionForm entryFeePln={entryFeePln} tshirtSizes={tshirtSizes} />
    </Stack>
  );
}
