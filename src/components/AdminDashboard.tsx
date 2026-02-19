"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Alert, Badge, Button, Card, CardBody, Stack, Table } from "react-bootstrap";
import { VehicleSubmission } from "@/lib/types";

type Props = {
  initialSubmissions: VehicleSubmission[];
};

export function AdminDashboard({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [message, setMessage] = useState("");

  async function changeStatus(id: string, status: "accepted" | "rejected") {
    const res = await fetch(`/api/submissions/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      setMessage("Nie udało się zaktualizować zgłoszenia.");
      return;
    }

    setSubmissions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setMessage("Status został zaktualizowany.");
  }

  async function logout() {
    await signOut({ callbackUrl: "/admin" });
  }

  return (
    <Stack gap={3} className="admin-stack">
      <Card className="form-card shadow-sm border-0 admin-toolbar">
        <CardBody className="d-flex flex-wrap justify-content-between align-items-center gap-2 admin-toolbar-body">
          <h1 className="mb-0 admin-title">Zgłoszenia ({submissions.length})</h1>
          <div className="d-flex gap-2 flex-wrap admin-toolbar-actions">
            <Button variant="outline-light" as="a" href="/api/submissions/export">
              Eksport CSV
            </Button>
            <Button variant="outline-light" onClick={logout}>
              Wyloguj
            </Button>
          </div>
        </CardBody>
      </Card>

      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="form-card shadow-sm border-0">
        <CardBody className="admin-table-card-body">
          <Table responsive hover className="mb-0 align-middle admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Pojazd</th>
                <th>Zgłaszający</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString("pl-PL")}</td>
                  <td>
                    {item.brand} {item.model} ({item.productionYear})
                    <br />
                    Rej: {item.registrationNumber}
                  </td>
                  <td>
                    {item.firstName} {item.lastName}
                    <br />
                    {item.email}
                    <br />
                    {item.phone}
                  </td>
                  <td>
                    <Badge
                      bg={item.status === "accepted" ? "success" : item.status === "rejected" ? "danger" : "secondary"}
                      className="admin-status-badge"
                    >
                      {item.status === "accepted"
                        ? "zaakceptowane"
                        : item.status === "rejected"
                          ? "odrzucone"
                          : "oczekuje"}
                    </Badge>
                  </td>
                  <td className="admin-actions-cell">
                    <div className="d-flex gap-2 flex-wrap admin-actions">
                      <Button size="sm" onClick={() => changeStatus(item.id, "accepted")}>
                        Akceptuj
                      </Button>
                      <Button size="sm" variant="outline-light" onClick={() => changeStatus(item.id, "rejected")}>
                        Odrzuć
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
}
