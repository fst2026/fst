"use client";

import { FormEvent, useState } from "react";
import { Alert, Button, Card, CardBody, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message")
        })
      });
      setState(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <Card className="form-card shadow-sm border-0">
      <CardBody>
        <Form onSubmit={onSubmit} className="d-grid gap-3">
          <h3>Formularz kontaktowy</h3>
          <FormGroup controlId="name">
            <FormLabel>Imię i nazwisko</FormLabel>
            <FormControl name="name" required />
          </FormGroup>
          <FormGroup controlId="email">
            <FormLabel>E-mail</FormLabel>
            <FormControl name="email" type="email" required />
          </FormGroup>
          <FormGroup controlId="message">
            <FormLabel>Wiadomość</FormLabel>
            <FormControl as="textarea" name="message" rows={5} required />
          </FormGroup>
          <Button type="submit" className="fw-semibold">Wyślij</Button>
          {state === "sent" ? <Alert variant="success">Dziękujemy. Wiadomość wysłana.</Alert> : null}
          {state === "error" ? <Alert variant="danger">Nie udało się wysłać wiadomości.</Alert> : null}
        </Form>
      </CardBody>
    </Card>
  );
}
