"use client";

import { FormEvent, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Row
} from "react-bootstrap";
import { MAX_PHOTOS, MAX_PHOTO_SIZE_BYTES, MIN_PHOTOS, TSHIRT_SIZES } from "@/lib/constants";

export function SubmissionForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll("photos").filter((item) => item instanceof File) as File[];

    if (files.length < MIN_PHOTOS) {
      setError(`Wymagane są minimum ${MIN_PHOTOS} zdjęcia pojazdu.`);
      setLoading(false);
      return;
    }

    if (files.length > MAX_PHOTOS) {
      setError(`Maksymalnie możesz dodać ${MAX_PHOTOS} zdjęć.`);
      setLoading(false);
      return;
    }

    const tooLarge = files.find((file) => file.size > MAX_PHOTO_SIZE_BYTES);
    if (tooLarge) {
      setError("Każde zdjęcie może mieć maksymalnie 5 MB.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData
      });

      const body = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(body.message ?? "Nie udało się wysłać zgłoszenia.");
      } else {
        setSuccess("Zgłoszenie zostało wysłane. Sprawdź e-mail po potwierdzenie przyjęcia.");
        form.reset();
      }
    } catch {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="form-card shadow-sm border-0">
      <CardBody>
        <Form onSubmit={onSubmit} className="d-grid gap-3">
          <h2>Formularz zgłoszeniowy</h2>
          <p className="mb-0 text-body-secondary">
            Zgłoszenia podlegają weryfikacji. Po akceptacji należy uiścić opłatę wpisową 150 zł.
            Na wjeździe uczestnik otrzymuje pakiet powitalny (koszulka + gadżety).
          </p>

          <h3 className="mt-2">Dane pojazdu</h3>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup controlId="brand">
                <FormLabel>Marka</FormLabel>
                <FormControl name="brand" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="model">
                <FormLabel>Model</FormLabel>
                <FormControl name="model" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="productionYear">
                <FormLabel>Rok produkcji</FormLabel>
                <FormControl name="productionYear" required inputMode="numeric" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="registrationNumber">
                <FormLabel>Numer rejestracyjny</FormLabel>
                <FormControl name="registrationNumber" required />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup controlId="modifications">
                <FormLabel>Opis modyfikacji</FormLabel>
                <FormControl as="textarea" name="modifications" rows={4} required />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup controlId="photos">
                <FormLabel>Zdjęcia pojazdu (min. 3, max 5, do 5 MB/szt.)</FormLabel>
                <FormControl name="photos" type="file" accept="image/*" multiple required />
              </FormGroup>
            </Col>
          </Row>

          <h3 className="mt-2">Dane zgłaszającego</h3>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup controlId="firstName">
                <FormLabel>Imię</FormLabel>
                <FormControl name="firstName" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="lastName">
                <FormLabel>Nazwisko</FormLabel>
                <FormControl name="lastName" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="email">
                <FormLabel>Adres e-mail</FormLabel>
                <FormControl name="email" type="email" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="phone">
                <FormLabel>Numer telefonu</FormLabel>
                <FormControl name="phone" required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="instagram">
                <FormLabel>Link do Instagrama</FormLabel>
                <FormControl name="instagram" type="url" placeholder="https://instagram.com/twoj_profil" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="tshirtSize">
                <FormLabel>Rozmiar koszulki</FormLabel>
                <FormSelect name="tshirtSize" defaultValue={TSHIRT_SIZES[2]} required>
                  {TSHIRT_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
            </Col>
          </Row>

          <FormCheck name="acceptedRules" type="checkbox" label="Akceptuję regulamin wydarzenia" required />
          <FormCheck
            name="acceptedRodo"
            type="checkbox"
            label="Wyrażam zgodę na przetwarzanie danych (RODO)"
            required
          />

          <Button type="submit" disabled={loading} className="fw-semibold">
            {loading ? "Wysyłanie..." : "Wyślij zgłoszenie"}
          </Button>

          {error ? <Alert variant="danger">{error}</Alert> : null}
          {success ? <Alert variant="success">{success}</Alert> : null}
        </Form>
      </CardBody>
    </Card>
  );
}
