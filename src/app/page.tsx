import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardBody, Col, Row, Stack } from "react-bootstrap";
import { EVENT_DATE, EVENT_LOCATION, EVENT_NAME, FACEBOOK_EVENT_URL } from "@/lib/constants";

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
  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80"
];

export default function HomePage() {
  return (
    <Stack gap={3}>
      <section className="hero d-grid gap-3">
        <h1>{EVENT_NAME}</h1>
        <p>
          <strong>Data:</strong> {EVENT_DATE}
          <br />
          <strong>Miejsce:</strong> {EVENT_LOCATION}
        </p>
        <div className="d-flex gap-2 flex-wrap">
          <Link href="/zglos-pojazd" className="btn btn-primary">
            ZGŁOŚ POJAZD
          </Link>
          <Button as="a" variant="outline-light" href={FACEBOOK_EVENT_URL} target="_blank" rel="noreferrer">
            f Facebook event
          </Button>
        </div>
      </section>

      <Card className="form-card shadow-sm border-0">
        <CardBody>
          <h2>Opis wydarzenia</h2>
          <p className="text-body-secondary mb-0">
            Fanatic Summer Car Show to spotkanie dla fanów motoryzacji i unikalnych projektów aut.
            Tworzymy luźny klimat, dużo rozmów o motoryzacji i strefę dla rodzin oraz odwiedzających.
            Na miejscu czekają prezentacje pojazdów, konkursy i część integracyjna.
          </p>
        </CardBody>
      </Card>

      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-3">
          <h2>Galeria poprzedniej edycji</h2>
          <div className="gallery">
            {galleryImages.map((src) => (
              <Image
                key={src}
                src={src}
                alt="Galeria Fanatic Summer Car Show"
                width={1200}
                height={800}
                sizes="(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="form-card shadow-sm border-0 h-100">
            <CardBody>
              <h2>Informacje organizacyjne</h2>
              <ul>
                <li>Parking dla odwiedzających dostępny przy wejściu głównym.</li>
                <li>Wydzielona strefa dla wystawców i uczestników z pojazdami.</li>
                <li>Atrakcje: konkursy, strefa foto, food trucki (zakres atrakcji będzie aktualizowany).</li>
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
                src="https://www.google.com/maps?q=Gdańsk&output=embed"
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
