import type { Metadata } from "next";
import { Stack } from "react-bootstrap";
import { SubmissionForm } from "@/components/SubmissionForm";

export const metadata: Metadata = {
  title: "Zgłoś pojazd - Fanatic Summer Car Show",
  description: "Formularz zgłoszeniowy pojazdu na Fanatic Summer Car Show.",
  alternates: { canonical: "/zglos-pojazd" }
};

export default function SubmitCarPage() {
  return (
    <Stack gap={3}>
      <h1>Zgłoś pojazd</h1>
      <SubmissionForm />
    </Stack>
  );
}
