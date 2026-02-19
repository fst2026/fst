"use client";

import { signIn } from "next-auth/react";
import { Button, Card, CardBody } from "react-bootstrap";

type Props = {
  oauthConfigured: boolean;
};

export function AdminLogin({ oauthConfigured }: Props) {
  return (
    <Card className="form-card shadow-sm border-0 admin-login mx-auto">
      <CardBody className="d-grid gap-3">
        <h2>Panel administracyjny</h2>
        <p className="mb-0 text-body-secondary">
          Logowanie do panelu admina odbywa się przez GitHub OAuth. Dostęp mają tylko adresy e-mail z allowlisty
          `ADMIN_EMAILS`.
        </p>
        {!oauthConfigured ? (
          <p className="mb-0 text-warning">Brak konfiguracji `AUTH_GITHUB_ID` lub `AUTH_GITHUB_SECRET`.</p>
        ) : null}
        <Button
          type="button"
          className="fw-semibold"
          disabled={!oauthConfigured}
          onClick={() => signIn("github", { callbackUrl: "/backstage" })}
        >
          Zaloguj przez GitHub
        </Button>
      </CardBody>
    </Card>
  );
}
