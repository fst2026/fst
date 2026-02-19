import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";

export const metadata: Metadata = {
  title: "O stowarzyszeniu - Fanatic Speed Team",
  description: "Poznaj misję i działalność stowarzyszenia Fanatic Speed Team.",
  alternates: { canonical: "/o-stowarzyszeniu" }
};

export default function AboutPage() {
  return (
    <Stack gap={3}>
      <h1>O stowarzyszeniu</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <h2>Kim jesteśmy</h2>
          <p>
            Fanatic Speed Team to grupa pasjonatów motoryzacji, która rozwija lokalną scenę eventową i
            integruje społeczność właścicieli wyjątkowych projektów.
          </p>
          <h2>Misja i cele</h2>
          <ul>
            <li>Budowanie przestrzeni dla fanów motoryzacji klasycznej i nowoczesnej.</li>
            <li>Promowanie bezpiecznej i świadomej kultury motoryzacyjnej.</li>
            <li>Wspieranie lokalnych inicjatyw i partnerstw.</li>
          </ul>
          <h2>Social media</h2>
          <p>
            Facebook:{" "}
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              facebook.com/fanaticspeedteam
            </a>
            <br />
            Instagram:{" "}
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              instagram.com/fanaticspeedteam
            </a>
          </p>
        </CardBody>
      </Card>
    </Stack>
  );
}
