import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardBody, Col, Row, Stack } from "react-bootstrap";
import { Gallery } from "@/components/Gallery";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Fanatic Summer Car Show - Strona główna",
  description: "Oficjalna strona wydarzenia Fanatic Summer Car Show: data, miejsce, atrakcje i zgłoszenia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fanatic Summer Car Show",
    description: "Oficjalna strona wydarzenia Fanatic Summer Car Show.",
    url: "/",
    siteName: "Fanatic Speed Team",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanatic Summer Car Show",
    description: "Oficjalna strona wydarzenia Fanatic Summer Car Show."
  }
};

const galleryImages = [
  "/1A6A7579.jpg",
  "/1A6A7655.jpg",
  "/1A6A7667.jpg",
  "/1A6A7720.jpg",
  "/IMG_8924.jpg",
  "/IMG_9142.jpg"
];

function formatEventDate(isoDate: string): string {
  if (!isoDate) return "Do ustalenia";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Do ustalenia";
  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function HomePage() {
  const settings = await getCachedSettings();
  const parkingMapEmbedUrl = settings.parkingMapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d301.31044246597634!2d18.52352320345179!3d50.58531670837844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4710e0f2fe9df7db%3A0x90ff252c5bf2bbad!2sBoisko%20pi%C5%82karskie!5e0!3m2!1spl!2spl!4v1771529430941!5m2!1spl!2spl";

  return (
    <Stack gap={3}>
      <section className="hero d-grid gap-3">
        <h1>{settings.eventName}</h1>
        <p>
          <strong>Data:</strong> {formatEventDate(settings.eventDate)}
          <br />
          <strong>Miejsce:</strong> {settings.eventLocation}
        </p>
        <div className="d-flex gap-2 flex-wrap">
          {settings.submissionsOpen ? (
            <Link href="/zglos-pojazd" className="btn btn-primary">
              ZGŁOŚ POJAZD
            </Link>
          ) : (
            <span
              className="btn btn-secondary disabled"
              aria-disabled="true"
              title="Zgłoszenia są obecnie zamknięte"
              style={{ pointerEvents: "none", opacity: 0.65 }}
            >
              ZGŁOSZENIA ZAMKNIĘTE
            </span>
          )}
          {settings.facebookEventUrl ? (
            <Button as="a" variant="outline-light" href={settings.facebookEventUrl} target="_blank" rel="noreferrer">
              f Facebook event
            </Button>
          ) : null}
        </div>
      </section>

      <Card className="form-card shadow-sm border-0">
        <CardBody>
          <h2>Opis wydarzenia</h2>
          <p className="text-body-secondary mb-0">
            Fanatic Summer Car Show to spotkanie dla fanów motoryzacji i unikalnych projektów. Tworzymy
            luźny klimat, dużo rozmów o motoryzacji i strefę dla rodzin oraz odwiedzających. Na miejscu
            czekają prezentacje pojazdów, konkursy i część integracyjna zakończona After-Party z
            najlepszymi DJ&apos;ami.
          </p>
        </CardBody>
      </Card>

      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-3">
          <h2>Galeria poprzedniej edycji</h2>
          <Gallery images={galleryImages} externalGalleryUrl="https://photos.app.goo.gl/XsdGBBe38Aq1AptN6" />
        </CardBody>
      </Card>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="form-card shadow-sm border-0 h-100">
            <CardBody>
              <h2>Informacje organizacyjne</h2>
              <ul>
                <li>Parking dla odwiedzających dostępny obok wydarzenia.</li>
                <li>Wydzielone strefy dla wystawców i uczestników z pojazdami.</li>
                <li>Atrakcje: konkursy, strefa foto, strefa gastronomiczna, strefa dla najmłodszych, pokaz strażacki, kino plenerowe oraz kąciki integracyjne.</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="form-card shadow-sm border-0 h-100">
            <CardBody>
              <h2>Dojazd</h2>
              <iframe
                title="Mapa dojazdu"
                src={parkingMapEmbedUrl}
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: 12 }}
                loading="lazy"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Stack>
  );
}
