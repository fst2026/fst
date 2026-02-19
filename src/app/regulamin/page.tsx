import type { Metadata } from "next";
import { Card, CardBody, Stack } from "react-bootstrap";

export const metadata: Metadata = {
  title: "Regulamin eventu - Fanatic Summer Car Show",
  description: "Zasady uczestnictwa, bezpieczeństwa i warunki wjazdu pojazdów.",
  alternates: { canonical: "/regulamin" }
};

export default function RulesPage() {
  return (
    <Stack gap={3}>
      <h1>Regulamin eventu</h1>
      <Card className="form-card shadow-sm border-0">
        <CardBody className="d-grid gap-2">
          <h2>Zasady uczestnictwa</h2>
          <ul>
            <li>Udział jest możliwy po poprawnym zgłoszeniu i akceptacji przez organizatora.</li>
            <li>Każdy uczestnik zobowiązuje się do zachowania kultury i bezpieczeństwa na terenie eventu.</li>
          </ul>
          <h2>Warunki wjazdu pojazdów</h2>
          <ul>
            <li>Wjazd pojazdu możliwy wyłącznie po wcześniejszej akceptacji zgłoszenia.</li>
            <li>Pojazd musi posiadać ważne dokumenty i spełniać podstawowe normy bezpieczeństwa.</li>
          </ul>
          <h2>Zasady bezpieczeństwa</h2>
          <ul>
            <li>Zakaz niekontrolowanych prób prędkości i driftu poza wyznaczoną strefą.</li>
            <li>Należy stosować się do poleceń organizatora i służb porządkowych.</li>
          </ul>
          <h2>Opłata wpisowa</h2>
          <p>Po akceptacji zgłoszenia obowiązuje opłata wpisowa 150 zł potwierdzająca przyjazd.</p>
          <h2>Odpowiedzialność organizatora</h2>
          <p>
            Organizator nie odpowiada za szkody wynikające z nieprzestrzegania regulaminu lub zdarzeń losowych.
          </p>
          <h2>RODO</h2>
          <p>
            Dane osobowe są przetwarzane wyłącznie na potrzeby organizacji wydarzenia i kontaktu z uczestnikami.
          </p>
        </CardBody>
      </Card>
    </Stack>
  );
}
