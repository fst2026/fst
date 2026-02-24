"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button, Card, CardBody } from "react-bootstrap";

type Props = {
  canEditSettings: boolean;
};

export function AdminNav({ canEditSettings }: Props) {
  const pathname = usePathname();

  async function logout() {
    await signOut({ callbackUrl: "/backstage" });
  }

  return (
    <Card className="form-card shadow-sm border-0 admin-toolbar">
      <CardBody className="admin-toolbar-body">
        <div className="admin-tabs">
          <Link
            href="/backstage/zgloszenia"
            className={`admin-tab ${pathname === "/backstage/zgloszenia" || pathname === "/backstage" ? "active" : ""}`}
          >
            Zgłoszenia
          </Link>
          {canEditSettings && (
            <Link
              href="/backstage/ustawienia"
              className={`admin-tab ${pathname === "/backstage/ustawienia" ? "active" : ""}`}
            >
              Ustawienia
            </Link>
          )}
        </div>
        <div className="admin-toolbar-actions">
          {(pathname === "/backstage/zgloszenia" || pathname === "/backstage") && (
            <Button variant="outline-light" size="sm" as="a" href="/api/submissions/export">
              Eksport CSV
            </Button>
          )}
          <Button variant="outline-light" size="sm" onClick={logout}>
            Wyloguj
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
