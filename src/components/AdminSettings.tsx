"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, CardBody, Col, Collapse, Form, Modal, Row, Spinner, Stack } from "react-bootstrap";
import { SiteSettings } from "@/lib/types";

type Props = {
  initialSettings: SiteSettings;
};

function CollapsibleCard({
  title,
  defaultOpen = false,
  children,
  variant
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  variant?: "danger";
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      className="form-card shadow-sm border-0"
      style={variant === "danger" ? { borderColor: "var(--bs-danger)", borderWidth: 1, borderStyle: "solid" } : undefined}
    >
      <CardBody className="p-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-100 d-flex justify-content-between align-items-center p-3 bg-transparent border-0 text-start"
          style={{ cursor: "pointer" }}
        >
          <h2 className={`h5 mb-0 ${variant === "danger" ? "text-danger" : ""}`}>{title}</h2>
          <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "white" }}>
            ▼
          </span>
        </button>
        <Collapse in={open}>
          <div>
            <div className="px-3 pb-3">
              {children}
            </div>
          </div>
        </Collapse>
      </CardBody>
    </Card>
  );
}

export function AdminSettings({ initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmissionsOpen, setPendingSubmissionsOpen] = useState<boolean | null>(null);

  function handleChange(key: keyof SiteSettings, value: string | number | boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmissionsToggle() {
    setPendingSubmissionsOpen(!settings.submissionsOpen);
    setShowConfirmModal(true);
  }

  function confirmSubmissionsToggle() {
    if (pendingSubmissionsOpen !== null) {
      setSettings((prev) => ({ ...prev, submissionsOpen: pendingSubmissionsOpen }));
    }
    setShowConfirmModal(false);
    setPendingSubmissionsOpen(null);
  }

  function cancelSubmissionsToggle() {
    setShowConfirmModal(false);
    setPendingSubmissionsOpen(null);
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
      router.refresh();
    } catch (err) {
      setMessage({ type: "danger", text: err instanceof Error ? err.message : "Wystąpił błąd" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset disabled={saving}>
      <Stack gap={3}>
        {message && (
          <Alert variant={message.type} className="admin-alert">
            {message.text}
          </Alert>
        )}

        {/* Strefa zagrożenia - zawsze otwarta */}
        <CollapsibleCard title="Strefa zagrożenia" defaultOpen variant="danger">
          <Row className="g-3">
            <Col md={12}>
              <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: "rgba(220, 53, 69, 0.15)" }}>
                <div>
                  <strong>Zgłoszenia pojazdów</strong>
                  <p className="mb-0 small opacity-75">
                    {settings.submissionsOpen
                      ? "Zgłoszenia są obecnie otwarte"
                      : "Zgłoszenia są obecnie zamknięte"}
                  </p>
                </div>
                <Button
                  variant={settings.submissionsOpen ? "outline-danger" : "success"}
                  onClick={handleSubmissionsToggle}
                  type="button"
                >
                  {settings.submissionsOpen ? "Zamknij zgłoszenia" : "Otwórz zgłoszenia"}
                </Button>
              </div>
            </Col>
            {!settings.submissionsOpen && (
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Komunikat dla użytkowników</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={settings.submissionsClosedMessage}
                    onChange={(e) => handleChange("submissionsClosedMessage", e.target.value)}
                    placeholder="Zgłoszenia są obecnie zamknięte..."
                  />
                </Form.Group>
              </Col>
            )}
          </Row>
        </CollapsibleCard>

        {/* Wydarzenie */}
        <CollapsibleCard title="Wydarzenie" defaultOpen>
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
        </CollapsibleCard>

        {/* Social Media */}
        <CollapsibleCard title="Social Media">
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
        </CollapsibleCard>

        {/* Dane stowarzyszenia */}
        <CollapsibleCard title="Dane stowarzyszenia">
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
                <Form.Label>Numer konta (darowizny)</Form.Label>
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
        </CollapsibleCard>

        {/* Płatności */}
        <CollapsibleCard title="Płatności (wpisowe)">
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
        </CollapsibleCard>

        {/* Mapy */}
        <CollapsibleCard title="Mapy">
          <Form.Group>
            <Form.Label>URL mapy parkingu</Form.Label>
            <Form.Control
              type="url"
              value={settings.parkingMapUrl}
              onChange={(e) => handleChange("parkingMapUrl", e.target.value)}
            />
          </Form.Group>
        </CollapsibleCard>

        {/* Formularz zgłoszeniowy */}
        <CollapsibleCard title="Formularz zgłoszeniowy">
          <Form.Group>
            <Form.Label>Rozmiary koszulek (oddzielone przecinkiem)</Form.Label>
            <Form.Control
              type="text"
              value={settings.tshirtSizes}
              onChange={(e) => handleChange("tshirtSizes", e.target.value)}
              placeholder="XS,S,M,L,XL,XXL,XXXL"
            />
            <Form.Text className="text-body-secondary">
              Wpisz dostępne rozmiary oddzielone przecinkiem
            </Form.Text>
          </Form.Group>
        </CollapsibleCard>

        {/* Szablony e-mail */}
        <CollapsibleCard title="Szablony e-mail">
          <Form.Text className="text-body-secondary d-block mb-3">
            Dostępne zmienne: {"{{firstName}}"}, {"{{entryFeePln}}"}, {"{{paymentBankAccount}}"}, {"{{paymentDeadlineText}}"}, {"{{paymentRecipientName}}"}, {"{{parkingMapUrl}}"}
          </Form.Text>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Po złożeniu zgłoszenia</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={settings.emailTemplateReceived}
                onChange={(e) => handleChange("emailTemplateReceived", e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Po akceptacji zgłoszenia</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={settings.emailTemplateAccepted}
                onChange={(e) => handleChange("emailTemplateAccepted", e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Po odrzuceniu zgłoszenia</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={settings.emailTemplateRejected}
                onChange={(e) => handleChange("emailTemplateRejected", e.target.value)}
              />
            </Form.Group>
          </Stack>
        </CollapsibleCard>

        <div className="d-flex justify-content-end gap-2 align-items-center">
          {saving && <Spinner animation="border" size="sm" />}
          <Button type="submit" disabled={saving}>
            {saving ? "Zapisywanie..." : "Zapisz ustawienia"}
          </Button>
        </div>
      </Stack>
      </fieldset>

      <Modal show={showConfirmModal} onHide={cancelSubmissionsToggle} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {pendingSubmissionsOpen ? "Otworzyć zgłoszenia?" : "Zamknąć zgłoszenia?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingSubmissionsOpen ? (
            <p>Czy na pewno chcesz <strong>otworzyć</strong> przyjmowanie zgłoszeń pojazdów?</p>
          ) : (
            <p>Czy na pewno chcesz <strong>zamknąć</strong> przyjmowanie zgłoszeń? Użytkownicy nie będą mogli składać nowych zgłoszeń.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelSubmissionsToggle}>
            Anuluj
          </Button>
          <Button
            variant={pendingSubmissionsOpen ? "success" : "danger"}
            onClick={confirmSubmissionsToggle}
          >
            {pendingSubmissionsOpen ? "Tak, otwórz" : "Tak, zamknij"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}
