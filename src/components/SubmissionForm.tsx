"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
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
  FormText,
  Row
} from "react-bootstrap";
import imageCompression from "browser-image-compression";
import { MAX_PHOTOS, MIN_PHOTOS } from "@/lib/constants";
import { validateRegistrationNumber } from "@/lib/form-validation";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

type FieldErrors = {
  productionYear?: string;
  phone?: string;
  registrationNumber?: string;
  instagram?: string;
};

function validateProductionYear(value: string): string | undefined {
  if (!value) return "Rok produkcji jest wymagany";
  const year = parseInt(value, 10);
  if (isNaN(year) || !/^\d{4}$/.test(value)) return "Wpisz poprawny rok (4 cyfry)";
  if (year < MIN_YEAR || year > CURRENT_YEAR + 1) return `Rok musi być między ${MIN_YEAR} a ${CURRENT_YEAR + 1}`;
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value) return "Numer telefonu jest wymagany";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 9) return "Numer telefonu musi mieć minimum 9 cyfr";
  if (digits.length > 15) return "Numer telefonu jest za długi";
  return undefined;
}

function validateRegistration(value: string): string | undefined {
  return validateRegistrationNumber(value);
}

function validateInstagram(value: string): string | undefined {
  if (!value) return undefined; // optional field
  // Accept: @username, username, or full URL
  const cleaned = value.trim();
  if (cleaned.startsWith("http")) {
    if (!cleaned.includes("instagram.com")) return "Wpisz link do Instagrama lub nazwę użytkownika";
  } else {
    const username = cleaned.replace(/^@/, "");
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) return "Nieprawidłowa nazwa użytkownika";
  }
  return undefined;
}

type SubmissionFormProps = {
  entryFeePln: number;
  tshirtSizes: string[];
};

export function SubmissionForm({ entryFeePln, tshirtSizes }: SubmissionFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function validateField(field: keyof FieldErrors, value: string) {
    let error: string | undefined;
    switch (field) {
      case "productionYear":
        error = validateProductionYear(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "registrationNumber":
        error = validateRegistration(value);
        break;
      case "instagram":
        error = validateInstagram(value);
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  }

  function onFieldChange(field: keyof FieldErrors, value: string) {
    if (touched[field]) {
      validateField(field, value);
    }
  }

  function onFieldBlur(field: keyof FieldErrors, value: string) {
    markTouched(field);
    validateField(field, value);
  }

  function onPickPhotos(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const incoming = Array.from(input.files ?? []);
    if (!incoming.length) return;

    if (selectedFiles.length + incoming.length > MAX_PHOTOS) {
      setError(`Maksymalnie możesz dodać ${MAX_PHOTOS} zdjęć.`);
      input.value = "";
      return;
    }

    setError("");

    const next = [...selectedFiles];
    for (const file of incoming) {
      const exists = next.some(
        (item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified
      );
      if (!exists) next.push(file);
    }

    setSelectedFiles(next);
    input.value = "";
  }

  function removePhoto(index: number) {
    setSelectedFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function clearPhotos() {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Validate all fields
    const productionYear = formData.get("productionYear") as string;
    const phone = formData.get("phone") as string;
    const registrationNumber = formData.get("registrationNumber") as string;
    const instagram = formData.get("instagram") as string;

    const errors: FieldErrors = {
      productionYear: validateProductionYear(productionYear),
      phone: validatePhone(phone),
      registrationNumber: validateRegistration(registrationNumber),
      instagram: validateInstagram(instagram)
    };

    setFieldErrors(errors);
    setTouched({ productionYear: true, phone: true, registrationNumber: true, instagram: true });

    const hasErrors = Object.values(errors).some((e) => e !== undefined);
    if (hasErrors) {
      setError("Popraw błędy w formularzu.");
      return;
    }

    const files = selectedFiles;
    if (files.length < MIN_PHOTOS) {
      setError(`Wymagane są minimum ${MIN_PHOTOS} zdjęcia pojazdu.`);
      return;
    }

    if (files.length > MAX_PHOTOS) {
      setError(`Maksymalnie możesz dodać ${MAX_PHOTOS} zdjęć.`);
      return;
    }

    setLoading(true);

    // Compress photos before upload
    let compressedFiles: File[];
    try {
      const compressionOptions = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg" as const
      };

      const compressed = await Promise.all(
        files.map(async (file) => {
          try {
            const result = await imageCompression(file, compressionOptions);
            const newName = file.name.replace(/\.(png|webp|jpeg|jpg)$/i, ".jpg");
            return new File([result], newName, { type: "image/jpeg" });
          } catch (err) {
            console.error(`Failed to compress ${file.name}:`, err);
            return null;
          }
        })
      );

      const valid = compressed.filter((f): f is File => f !== null);
      if (valid.length !== files.length) {
        setError("Nie udało się przetworzyć niektórych zdjęć. Spróbuj ponownie.");
        setLoading(false);
        return;
      }

      compressedFiles = valid;
    } catch (err) {
      console.error("Compression error:", err);
      setError("Błąd podczas przetwarzania zdjęć. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    // Safety check: verify total payload size is under Vercel limit
    const totalPhotoSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxSafeSize = 4 * 1024 * 1024;
    if (totalPhotoSize > maxSafeSize) {
      setError(
        `Zdjęcia są za duże (${Math.ceil(totalPhotoSize / 1024 / 1024)} MB). Spróbuj ponownie lub usuń niektóre zdjęcia.`
      );
      setLoading(false);
      return;
    }

    // Normalize registration number
    const normalizedRegistration = registrationNumber.trim().toUpperCase().replace(/\s+/g, " ");

    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      if (key === "registrationNumber") {
        payload.append(key, normalizedRegistration);
      } else {
        payload.append(key, value);
      }
    }
    for (const file of compressedFiles) payload.append("photos", file);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: payload
      });

      const body = (await res.json()) as { message?: string };
      if (!res.ok) {
        if (res.status === 413) {
          setError("Zdjęcia są za duże. Spróbuj wybrać mniej zdjęć lub mniejsze pliki.");
        } else {
          setError(body.message ?? "Nie udało się wysłać zgłoszenia.");
        }
      } else {
        setSuccess("Zgłoszenie zostało wysłane. Sprawdź e-mail po potwierdzenie przyjęcia.");
        form.reset();
        clearPhotos();
        setFieldErrors({});
        setTouched({});
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
        <Form onSubmit={onSubmit} className="d-grid gap-3" noValidate>
          <h2>Formularz zgłoszeniowy</h2>
          <p className="mb-0 text-body-secondary">
            Zgłoszenia podlegają weryfikacji. Po akceptacji należy uiścić opłatę wpisową {entryFeePln} zł. Na wjeździe uczestnik
            otrzymuje pakiet powitalny (koszulka + gadżety).
          </p>

          <h3 className="mt-2">Dane pojazdu</h3>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup controlId="brand">
                <FormLabel>Marka</FormLabel>
                <FormControl name="brand" required maxLength={50} autoComplete="off" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="model">
                <FormLabel>Model</FormLabel>
                <FormControl name="model" required maxLength={50} autoComplete="off" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="productionYear">
                <FormLabel>Rok produkcji</FormLabel>
                <FormControl
                  name="productionYear"
                  required
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  placeholder={`np. ${CURRENT_YEAR - 5}`}
                  isInvalid={touched.productionYear && !!fieldErrors.productionYear}
                  onChange={(e) => onFieldChange("productionYear", e.target.value)}
                  onBlur={(e) => onFieldBlur("productionYear", e.target.value)}
                />
                {touched.productionYear && fieldErrors.productionYear && (
                  <FormText className="text-danger">{fieldErrors.productionYear}</FormText>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="registrationNumber">
                <FormLabel>Numer rejestracyjny</FormLabel>
                <FormControl
                  name="registrationNumber"
                  required
                  maxLength={10}
                  placeholder="np. GD 12345"
                  style={{ textTransform: "uppercase" }}
                  isInvalid={touched.registrationNumber && !!fieldErrors.registrationNumber}
                  onChange={(e) => onFieldChange("registrationNumber", e.target.value)}
                  onBlur={(e) => onFieldBlur("registrationNumber", e.target.value)}
                />
                {touched.registrationNumber && fieldErrors.registrationNumber && (
                  <FormText className="text-danger">{fieldErrors.registrationNumber}</FormText>
                )}
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup controlId="modifications">
                <FormLabel>Opis modyfikacji</FormLabel>
                <FormControl as="textarea" name="modifications" rows={4} required maxLength={2000} />
                <FormText className="text-body-secondary">Opisz wykonane modyfikacje (max 2000 znaków)</FormText>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup controlId="photos">
                <FormLabel>
                  Zdjęcia pojazdu (min. {MIN_PHOTOS}, max {MAX_PHOTOS}, do 5 MB/szt.)
                </FormLabel>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <Button
                    type="button"
                    variant="outline-light"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    Dodaj zdjęcia
                  </Button>
                  <Button
                    type="button"
                    variant="outline-light"
                    onClick={clearPhotos}
                    disabled={!selectedFiles.length || loading}
                  >
                    Wyczyść
                  </Button>
                  <span className="small text-body-secondary">
                    Wybrano: {selectedFiles.length}/{MAX_PHOTOS}
                  </span>
                </div>
                <FormControl
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={onPickPhotos}
                  className="d-none"
                />
                <FormText className="text-body-secondary d-block mt-2">
                  Zdjęcia są automatycznie optymalizowane przed wysłaniem dla najlepszej jakości
                </FormText>
                {selectedFiles.length > 0 && (
                  <div className="d-grid gap-1 mt-2">
                    {selectedFiles.map((file, index) => (
                      <div key={`${file.name}-${file.lastModified}-${index}`} className="d-flex justify-content-between gap-2">
                        <span className="small text-break">
                          {file.name} ({Math.ceil(file.size / 1024)} KB)
                        </span>
                        <Button type="button" size="sm" variant="outline-light" onClick={() => removePhoto(index)}>
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <h3 className="mt-2">Dane zgłaszającego</h3>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup controlId="firstName">
                <FormLabel>Imię</FormLabel>
                <FormControl name="firstName" required maxLength={50} autoComplete="given-name" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="lastName">
                <FormLabel>Nazwisko</FormLabel>
                <FormControl name="lastName" required maxLength={50} autoComplete="family-name" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="email">
                <FormLabel>Adres e-mail</FormLabel>
                <FormControl name="email" type="email" required maxLength={100} autoComplete="email" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="phone">
                <FormLabel>Numer telefonu</FormLabel>
                <FormControl
                  name="phone"
                  type="tel"
                  required
                  maxLength={20}
                  placeholder="np. 123 456 789"
                  autoComplete="tel"
                  inputMode="tel"
                  isInvalid={touched.phone && !!fieldErrors.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                  onBlur={(e) => onFieldBlur("phone", e.target.value)}
                />
                {touched.phone && fieldErrors.phone && <FormText className="text-danger">{fieldErrors.phone}</FormText>}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="instagram">
                <FormLabel>
                  Instagram <span className="text-body-secondary">(opcjonalnie)</span>
                </FormLabel>
                <FormControl
                  name="instagram"
                  placeholder="@nazwa lub link"
                  maxLength={100}
                  isInvalid={touched.instagram && !!fieldErrors.instagram}
                  onChange={(e) => onFieldChange("instagram", e.target.value)}
                  onBlur={(e) => onFieldBlur("instagram", e.target.value)}
                />
                {touched.instagram && fieldErrors.instagram && (
                  <FormText className="text-danger">{fieldErrors.instagram}</FormText>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup controlId="tshirtSize">
                <FormLabel>Rozmiar koszulki</FormLabel>
                <FormSelect name="tshirtSize" defaultValue={tshirtSizes[2] ?? tshirtSizes[0]} required>
                  {tshirtSizes.map((size) => (
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
            {loading ? "Przetwarzanie i wysyłanie..." : "Wyślij zgłoszenie"}
          </Button>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Form>
      </CardBody>
    </Card>
  );
}
