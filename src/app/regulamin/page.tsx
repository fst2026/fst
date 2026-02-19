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
        <CardBody className="d-grid gap-3">
          <section>
            <h2>Zasady uczestnictwa</h2>
            <ol>
              <li>Wstęp dla Odwiedzających oraz Pasażerów jest darmowy.</li>
              <li>Udział z pojazdem jest możliwy po poprawnym zgłoszeniu i akceptacji przez Organizatora.</li>
              <li>Każdy Uczestnik zobowiązuje się do zachowania kultury i bezpieczeństwa na terenie wydarzenia.</li>
              <li>Każdy Uczestnik zobowiązany jest do przestrzegania zasad panujących na terenie wydarzenia.</li>
              <li>Osoby małoletnie mogą uczestniczyć w Wydarzeniu wyłącznie za zgodą oraz pod stałą opieką rodzica, opiekuna prawnego lub innej osoby dorosłej upoważnionej przez rodzica lub opiekuna prawnego.</li>
            </ol>
          </section>

          <section>
            <h2>Warunki wjazdu pojazdów</h2>
            <ol>
              <li>Wjazd pojazdu na teren wydarzenia możliwy wyłącznie po wcześniejszej akceptacji zgłoszenia.</li>
              <li>Każdy pojazd uczestniczący w Wydarzeniu musi posiadać ważne i aktualne badanie techniczne dopuszczające go do ruchu drogowego oraz wszystkie wymagane przepisami prawa ubezpieczenia, w szczególności obowiązkowe ubezpieczenie odpowiedzialności cywilnej (OC).</li>
              <li>Organizator ma prawo odmówić dopuszczenia do udziału w Wydarzeniu pojazdu niespełniającego powyższych wymogów.</li>
            </ol>
          </section>

          <section>
            <h2>Zasady bezpieczeństwa</h2>
            <ol>
              <li>Podczas Wydarzenia obowiązuje bezwzględny zakaz podejmowania zachowań niebezpiecznych, w szczególności driftu, tzw. &bdquo;upalania&rdquo;, organizowania wyścigów oraz innych form brawurowej jazdy.</li>
              <li>Uczestnikom zabrania się poruszania pojazdami po spożyciu alkoholu, środków odurzających, substancji psychotropowych lub innych środków mogących wpływać na zdolność prowadzenia pojazdu.</li>
              <li>Naruszenie powyższych zasad może skutkować natychmiastowym wykluczeniem z Wydarzenia oraz poniesieniem odpowiedzialności przewidzianej przepisami prawa.</li>
            </ol>
          </section>

          <section>
            <h2>Opłata wpisowa</h2>
            <p>
              Po akceptacji zgłoszenia obowiązuje opłata. Informacje o wysokości opłaty oraz danych do jej
              uiszczenia zostaną przekazane drogą elektroniczną (E-Mail).
            </p>
          </section>

          <section>
            <h2>Odpowiedzialność organizatora</h2>
            <ol>
              <li>Organizator nie ponosi odpowiedzialności za szkody powstałe w trakcie Wydarzenia, wyrządzone przez osoby trzecie ani za szkody będące następstwem zdarzeń losowych, siły wyższej lub innych okoliczności niezależnych od Organizatora.</li>
              <li>Za szkody wyrządzone podczas Wydarzenia przez osoby trzecie odpowiedzialność ponosi bezpośrednio osoba, która daną szkodę spowodowała, zgodnie z obowiązującymi przepisami prawa.</li>
            </ol>
          </section>

          <section>
            <h2>RODO</h2>
            <ol>
              <li>Administratorem danych osobowych uczestników jest Organizator. Dane osobowe są przetwarzane wyłącznie w celu organizacji Wydarzenia oraz kontaktu z uczestnikami w sprawach związanych z jego realizacją, zgodnie z obowiązującymi przepisami o ochronie danych osobowych.</li>
              <li>Podczas Wydarzenia mogą być wykonywane zdjęcia oraz materiały wideo, które mogą zawierać wizerunek uczestników. Uczestnictwo w Wydarzeniu jest równoznaczne z wyrażeniem zgody na nieodpłatne utrwalanie i wykorzystanie wizerunku w materiałach promocyjnych i informacyjnych Organizatora, w szczególności w mediach społecznościowych oraz na stronie internetowej Organizatora.</li>
              <li>Dane osobowe uczestników nie są wykorzystywane w celach innych niż wskazane powyżej oraz nie są udostępniane podmiotom trzecim, z wyjątkiem przypadków przewidzianych przepisami prawa.</li>
            </ol>
          </section>
        </CardBody>
      </Card>
    </Stack>
  );
}
