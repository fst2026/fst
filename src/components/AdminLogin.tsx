"use client";

import { signIn } from "next-auth/react";
import { Button, Card, CardBody } from "react-bootstrap";

type Props = {
  oauthConfigured: boolean;
  authConfigIssue: string | null;
};

function issueMessage(issue: string | null) {
  if (issue === "missing_oauth_credentials") {
    return "Brak konfiguracji `AUTH_GITHUB_ID` lub `AUTH_GITHUB_SECRET`.";
  }
  if (issue === "weak_auth_secret") {
    return "Ustaw `AUTH_SECRET` (minimum 32 znaki).";
  }
  if (issue === "missing_admin_allowlist") {
    return "Ustaw `ADMIN_EMAILS` (co najmniej 1 adres e-mail).";
  }
  return null;
}

export function AdminLogin({ oauthConfigured, authConfigIssue }: Props) {
  const warning = issueMessage(authConfigIssue);

  return (
    <Card className="form-card shadow-sm border-0 admin-login mx-auto">
      <CardBody className="d-grid gap-3">
        <h2>Panel administracyjny</h2>
        <p className="mb-0 text-body-secondary">
          Logowanie do panelu admina odbywa się przez GitHub OAuth. Dostęp mają tylko adresy e-mail z allowlisty
          `ADMIN_EMAILS`.
        </p>
        {!oauthConfigured && warning ? <p className="mb-0 text-warning">{warning}</p> : null}
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
