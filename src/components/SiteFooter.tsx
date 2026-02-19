import Link from "next/link";
import { Container } from "react-bootstrap";
import { getCachedSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getCachedSettings();

  return (
    <footer className="site-footer">
      <Container className="footer-shell">
        <div className="footer-top">
          <div className="footer-left">
            <strong className="footer-brand-name">Fanatic Speed Team</strong>
          </div>

          <div className="footer-right">
            <div className="footer-links">
              <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
              <Link href="/regulamin">Regulamin eventu</Link>
              <Link href="/kontakt">Pomoc i kontakt</Link>
            </div>
            <div className="footer-socials">
              <a href={settings.socialTiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3c.3 1.6 1.3 2.9 2.8 3.5.8.3 1.7.5 2.7.5v3.1c-1.8 0-3.5-.5-5-1.4V15c0 3.6-2.9 6.5-6.5 6.5S4 18.6 4 15s2.9-6.5 6.5-6.5c.3 0 .7 0 1 .1v3.3c-.3-.1-.6-.2-1-.2-1.8 0-3.3 1.5-3.3 3.3 0 1.9 1.5 3.3 3.3 3.3 1.9 0 3.4-1.4 3.4-3.8V3h2.6z" /></svg>
              </a>
              <a href={settings.socialInstagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm10.3 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
              </a>
              <a href={settings.socialFacebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9c0-.9.3-1.5 1.6-1.5h1.7V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.7v8h2.8z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <p className="footer-copy mb-0">© {new Date().getFullYear()} Wszystkie prawa zastrzeżone.</p>
      </Container>
    </footer>
  );
}
