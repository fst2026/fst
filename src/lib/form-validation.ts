export function validateRegistrationNumber(value: string): string | undefined {
  if (!value) return "Numer rejestracyjny jest wymagany";
  const cleaned = value.trim().toUpperCase();
  if (cleaned.length < 4) return "Numer rejestracyjny jest za krótki";
  if (cleaned.length > 10) return "Numer rejestracyjny jest za długi";
  if (!/^[A-Z0-9 ]+$/.test(cleaned)) return "Dozwolone tylko litery i cyfry";
  return undefined;
}
