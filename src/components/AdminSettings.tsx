"use client";

import { useState } from "react";
import { Alert, Button, Card, CardBody, Col, Form, Row, Stack } from "react-bootstrap";
import { SiteSettings } from "@/lib/types";

type Props = {
  initialSettings: SiteSettings;
};

export function AdminSettings({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);

  function handleChange(key: keyof SiteSettings, value: string | number) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Nie udało się zapisać ustawień");
      }

      const updated = await res.json();
      setSettings(updated);
      setMessage({ type: "success", text: "Ustawienia zostały zapisane." });
    } catch (err) {
      setMessage({ type: "danger", text: err instanceof Error ? err.message : "Wystąpił błąd" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={3}>
        {message && (
          <Alert variant={message.type} className="admin-alert">
            {message.text}
          </Alert>
        )}

        {/* Wydarzenie */}
        <Card className="form-card shadow-sm border-0">
          <CardBody>
            <h2 className="h5 mb-3">Wydarzenie</h2>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nazwa wydarzenia</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.eventName}
                    onChange={(e) => handleChange("eventName", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Data wydarzenia</Form.Label>
                  <Form.Control
                    type="date"
                    value={settings.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Lokalizacja</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.eventLocation}
                    onChange={(e) => handleChange("eventLocation", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>URL wydarzenia na Facebooku</Form.Label>
                  <Form.Control
                    type="url"
                    value={settings.facebookEventUrl}
                    onChange={(e) => handleChange("facebookEventUrl", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>URL galerii Dropbox</Form.Label>
                  <Form.Control
                    type="url"
                    value={settings.galleryDropboxUrl}
                    onChange={(e) => handleChange("galleryDropboxUrl", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Social Media */}
        <Card className="form-card shadow-sm border-0">
          <CardBody>
            <h2 className="h5 mb-3">Social Media</h2>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="url"
                    value={settings.socialFacebook}
                    onChange={(e) => handleChange("socialFacebook", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="url"
                    value={settings.socialInstagram}
                    onChange={(e) => handleChange("socialInstagram", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>TikTok</Form.Label>
                  <Form.Control
                    type="url"
                    value={settings.socialTiktok}
                    onChange={(e) => handleChange("socialTiktok", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Dane stowarzyszenia */}
        <Card className="form-card shadow-sm border-0">
          <CardBody>
            <h2 className="h5 mb-3">Dane stowarzyszenia</h2>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nazwa stowarzyszenia</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.associationName}
                    onChange={(e) => handleChange("associationName", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>NIP</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.associationTaxId}
                    onChange={(e) => handleChange("associationTaxId", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Numer konta</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.associationAccountNumber}
                    onChange={(e) => handleChange("associationAccountNumber", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email kontaktowy</Form.Label>
                  <Form.Control
                    type="email"
                    value={settings.associationContactEmail}
                    onChange={(e) => handleChange("associationContactEmail", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Płatności */}
        <Card className="form-card shadow-sm border-0">
          <CardBody>
            <h2 className="h5 mb-3">Płatności</h2>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Kwota wpisowego (PLN)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={settings.entryFeePln}
                    onChange={(e) => handleChange("entryFeePln", parseInt(e.target.value) || 0)}
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Termin płatności (tekst)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.paymentDeadlineText}
                    onChange={(e) => handleChange("paymentDeadlineText", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nazwa odbiorcy płatności</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.paymentRecipientName}
                    onChange={(e) => handleChange("paymentRecipientName", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Numer konta do płatności</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.paymentBankAccount}
                    onChange={(e) => handleChange("paymentBankAccount", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Mapy */}
        <Card className="form-card shadow-sm border-0">
          <CardBody>
            <h2 className="h5 mb-3">Mapy</h2>
            <Form.Group>
              <Form.Label>URL mapy parkingu</Form.Label>
              <Form.Control
                type="url"
                value={settings.parkingMapUrl}
                onChange={(e) => handleChange("parkingMapUrl", e.target.value)}
              />
            </Form.Group>
          </CardBody>
        </Card>

        <div className="d-flex justify-content-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Zapisywanie..." : "Zapisz ustawienia"}
          </Button>
        </div>
      </Stack>
    </Form>
  );
}
