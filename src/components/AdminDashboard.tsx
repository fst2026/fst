"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Alert, Badge, Button, Card, CardBody, Carousel, Modal, Stack } from "react-bootstrap";
import { SiteSettings, VehicleSubmission } from "@/lib/types";
import { AdminSettings } from "@/components/AdminSettings";

type Props = {
  initialSubmissions: VehicleSubmission[];
  initialSettings: SiteSettings;
  canEditSettings: boolean;
};

function StatusBadge({ status }: { status: string }) {
  const bg = status === "accepted" ? "success" : status === "rejected" ? "danger" : "secondary";
  const label = status === "accepted" ? "zaakceptowane" : status === "rejected" ? "odrzucone" : "oczekuje";
  return (
    <Badge bg={bg} className="admin-status-badge">
      {label}
    </Badge>
  );
}

function SubmissionCard({
  item,
  onAccept,
  onReject,
  onOpenGallery
}: {
  item: VehicleSubmission;
  onAccept: () => void;
  onReject: () => void;
  onOpenGallery: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="form-card shadow-sm border-0 admin-card">
      <CardBody className="admin-card-body">
        <div className="admin-card-header">
          <div className="admin-card-vehicle">
            <strong>
              {item.brand} {item.model}
            </strong>
            <span className="admin-card-year">({item.productionYear})</span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="admin-card-reg">{item.registrationNumber}</div>

        <div className="admin-card-meta">
          <span>{new Date(item.createdAt).toLocaleDateString("pl-PL")}</span>
          <span>
            {item.firstName} {item.lastName}
          </span>
        </div>

        {item.photoPaths.length > 0 && (
          <div className="admin-card-photos">
            {item.photoPaths.slice(0, 4).map((src, index) => (
              <button key={src} type="button" className="admin-photo-thumb" onClick={() => onOpenGallery(index)} aria-label={`Otwórz zdjęcie ${index + 1}`}>
                <Image src={src} alt={`Zdjęcie pojazdu`} width={72} height={72} className="admin-photo-thumb-image" unoptimized />
              </button>
            ))}
            {item.photoPaths.length > 4 && (
              <button type="button" className="admin-photo-more" onClick={() => onOpenGallery(0)} aria-label="Pokaż wszystkie zdjęcia">
                +{item.photoPaths.length - 4}
              </button>
            )}
          </div>
        )}

        <button type="button" className="admin-card-expand" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Zwiń szczegóły" : "Pokaż szczegóły"}
        </button>

        {expanded && (
          <div className="admin-card-details">
            <div className="admin-card-detail">
              <span className="admin-card-label">Email</span>
              <a href={`mailto:${item.email}`}>{item.email}</a>
            </div>
            <div className="admin-card-detail">
              <span className="admin-card-label">Telefon</span>
              <a href={`tel:${item.phone}`}>{item.phone}</a>
            </div>
            {item.instagram && (
              <div className="admin-card-detail">
                <span className="admin-card-label">Instagram</span>
                <span>@{item.instagram.replace(/^@/, "")}</span>
              </div>
            )}
            <div className="admin-card-detail">
              <span className="admin-card-label">Rozmiar koszulki</span>
              <span>{item.tshirtSize}</span>
            </div>
            <div className="admin-card-detail admin-card-detail-full">
              <span className="admin-card-label">Modyfikacje</span>
              <p className="admin-card-mods">{item.modifications}</p>
            </div>
          </div>
        )}

        {item.status === "pending" && (
          <div className="admin-card-actions">
            <Button size="sm" onClick={onAccept} className="admin-card-btn-accept">
              Akceptuj
            </Button>
            <Button size="sm" variant="outline-light" onClick={onReject}>
              Odrzuć
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function SubmissionRow({
  item,
  onAccept,
  onReject,
  onOpenGallery
}: {
  item: VehicleSubmission;
  onAccept: () => void;
  onReject: () => void;
  onOpenGallery: (index: number) => void;
}) {
  return (
    <tr>
      <td className="admin-table-date">{new Date(item.createdAt).toLocaleString("pl-PL")}</td>
      <td>
        <div className="admin-table-vehicle">
          <strong>
            {item.brand} {item.model}
          </strong>{" "}
          ({item.productionYear})
        </div>
        <div className="admin-table-reg">Rej: {item.registrationNumber}</div>
        <div className="admin-table-mods">{item.modifications}</div>
      </td>
      <td>
        <div>
          {item.firstName} {item.lastName}
        </div>
        <div className="admin-table-contact">
          <a href={`mailto:${item.email}`}>{item.email}</a>
        </div>
        <div className="admin-table-contact">
          <a href={`tel:${item.phone}`}>{item.phone}</a>
        </div>
        {item.instagram && <div className="admin-table-contact">@{item.instagram.replace(/^@/, "")}</div>}
        <div className="admin-table-tshirt">Koszulka: {item.tshirtSize}</div>
      </td>
      <td className="admin-photo-cell">
        {item.photoPaths.length ? (
          <div className="admin-photo-grid">
            {item.photoPaths.slice(0, 3).map((src, index) => (
              <button key={src} type="button" className="admin-photo-thumb" onClick={() => onOpenGallery(index)} aria-label={`Otwórz zdjęcie ${index + 1}`}>
                <Image src={src} alt={`Zdjęcie pojazdu ${item.brand} ${item.model}`} width={56} height={56} className="admin-photo-thumb-image" unoptimized />
              </button>
            ))}
            {item.photoPaths.length > 3 && (
              <button type="button" className="admin-photo-more" onClick={() => onOpenGallery(0)} aria-label="Pokaż wszystkie zdjęcia">
                +{item.photoPaths.length - 3}
              </button>
            )}
          </div>
        ) : (
          <span className="text-body-secondary">brak</span>
        )}
      </td>
      <td>
        <StatusBadge status={item.status} />
      </td>
      <td className="admin-actions-cell">
        {item.status === "pending" ? (
          <div className="admin-actions">
            <Button size="sm" onClick={onAccept}>
              Akceptuj
            </Button>
            <Button size="sm" variant="outline-light" onClick={onReject}>
              Odrzuć
            </Button>
          </div>
        ) : (
          <span className="text-body-secondary">zakończone</span>
        )}
      </td>
    </tr>
  );
}

export function AdminDashboard({ initialSubmissions, initialSettings, canEditSettings }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [message, setMessage] = useState("");
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [activeTab, setActiveTab] = useState<"submissions" | "settings">("submissions");

  const filteredSubmissions = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    accepted: submissions.filter((s) => s.status === "accepted").length,
    rejected: submissions.filter((s) => s.status === "rejected").length
  };

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
    setTimeout(() => setMessage(""), 3000);
  }

  async function logout() {
    await signOut({ callbackUrl: "/backstage" });
  }

  function openGallery(item: VehicleSubmission, startIndex = 0) {
    if (!item.photoPaths.length) return;
    setGalleryPhotos(item.photoPaths);
    setGalleryIndex(startIndex);
    setGalleryTitle(`${item.brand} ${item.model} (${item.registrationNumber})`);
    setShowGallery(true);
  }

  function closeGallery() {
    setShowGallery(false);
    setGalleryPhotos([]);
    setGalleryIndex(0);
    setGalleryTitle("");
  }

  return (
    <Stack gap={3} className="admin-stack">
      {/* Toolbar */}
      <Card className="form-card shadow-sm border-0 admin-toolbar">
        <CardBody className="admin-toolbar-body">
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === "submissions" ? "active" : ""}`}
              onClick={() => setActiveTab("submissions")}
            >
              Zgłoszenia
            </button>
            {canEditSettings && (
              <button
                type="button"
                className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                Ustawienia
              </button>
            )}
          </div>
          <div className="admin-toolbar-actions">
            {activeTab === "submissions" && (
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

      {activeTab === "settings" && canEditSettings && <AdminSettings initialSettings={initialSettings} />}

      {activeTab === "submissions" && (
        <>
          {/* Filters */}
          <div className="admin-filters">
            <button type="button" className={`admin-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              Wszystkie <span className="admin-filter-count">{counts.all}</span>
            </button>
            <button type="button" className={`admin-filter ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
              Oczekujące <span className="admin-filter-count">{counts.pending}</span>
            </button>
            <button type="button" className={`admin-filter ${filter === "accepted" ? "active" : ""}`} onClick={() => setFilter("accepted")}>
              Zaakceptowane <span className="admin-filter-count">{counts.accepted}</span>
            </button>
            <button type="button" className={`admin-filter ${filter === "rejected" ? "active" : ""}`} onClick={() => setFilter("rejected")}>
              Odrzucone <span className="admin-filter-count">{counts.rejected}</span>
            </button>
          </div>

          {message && (
            <Alert variant="success" className="admin-alert">
              {message}
            </Alert>
          )}

          {/* Mobile: Cards */}
          <div className="admin-cards">
            {filteredSubmissions.map((item) => (
              <SubmissionCard
                key={item.id}
                item={item}
                onAccept={() => changeStatus(item.id, "accepted")}
                onReject={() => changeStatus(item.id, "rejected")}
                onOpenGallery={(index) => openGallery(item, index)}
              />
            ))}
            {filteredSubmissions.length === 0 && <p className="admin-empty">Brak zgłoszeń w tej kategorii.</p>}
          </div>

          {/* Desktop: Table */}
          <Card className="form-card shadow-sm border-0 admin-table-wrapper">
            <CardBody className="admin-table-card-body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Pojazd</th>
                    <th>Zgłaszający</th>
                    <th>Zdjęcia</th>
                    <th>Status</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((item) => (
                    <SubmissionRow
                      key={item.id}
                      item={item}
                      onAccept={() => changeStatus(item.id, "accepted")}
                      onReject={() => changeStatus(item.id, "rejected")}
                      onOpenGallery={(index) => openGallery(item, index)}
                    />
                  ))}
                </tbody>
              </table>
              {filteredSubmissions.length === 0 && <p className="admin-empty">Brak zgłoszeń w tej kategorii.</p>}
            </CardBody>
          </Card>
        </>
      )}

      {/* Gallery Modal */}
      <Modal show={showGallery} onHide={closeGallery} centered size="lg" className="admin-gallery-modal">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="admin-gallery-title">{galleryTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {galleryPhotos.length > 0 && (
            <Carousel activeIndex={galleryIndex} onSelect={(selectedIndex) => setGalleryIndex(selectedIndex)} interval={null} indicators={galleryPhotos.length > 1}>
              {galleryPhotos.map((src, index) => (
                <Carousel.Item key={`${src}-${index}`}>
                  <Image src={src} alt={`Zdjęcie ${index + 1}`} width={1600} height={1000} className="admin-gallery-image" unoptimized />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
          {galleryPhotos.length > 0 && (
            <div className="admin-gallery-count">
              {galleryIndex + 1} / {galleryPhotos.length}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Stack>
  );
}
