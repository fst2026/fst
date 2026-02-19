import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "O stowarzyszeniu - Fanatic Speed Team",
  description: "Poznaj misję i działalność stowarzyszenia Fanatic Speed Team.",
  alternates: { canonical: "/o-stowarzyszeniu" }
};

const FALLBACK_SOCIALS = {
  facebook: "https://www.facebook.com/share/1CGDRcHNCf/",
  instagram: "https://www.instagram.com/fanaticspeedteam",
  tiktok: "https://www.tiktok.com/@fanaticspeedteam"
};

export default async function AboutPage() {
  const settings = await getCachedSettings();
  const socials = {
    facebook: settings.socialFacebook || FALLBACK_SOCIALS.facebook,
    instagram: settings.socialInstagram || FALLBACK_SOCIALS.instagram,
    tiktok: settings.socialTiktok || FALLBACK_SOCIALS.tiktok
  };

  return (
    <Stack gap={3}>
      <h1>O stowarzyszeniu</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-3">
          <section>
            <h2>Kim jesteśmy</h2>
            <p>
              Fanatic Speed Team to grupa pasjonatów motoryzacji, która rozwija lokalną scenę eventową
              oraz motoryzacyjną.
            </p>
          </section>

          <section>
            <h2>Nasze cele</h2>
            <ul>
              <li>Budowanie przestrzeni dla fanów motoryzacji klasycznej i nowoczesnej.</li>
              <li>Promowanie bezpiecznej i świadomej kultury motoryzacyjnej.</li>
              <li>Wspieranie lokalnych inicjatyw i partnerstw.</li>
              <li>Integracja społeczności i wdrażanie pasji w młodzież.</li>
            </ul>
          </section>

          <section>
            <h2>Social media</h2>
            <p className="d-flex flex-column gap-2">
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            </p>
          </section>
        </CardBody>
      </Card>
    </Stack>
  );
}
