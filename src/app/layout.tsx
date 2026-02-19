import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCachedSettings } from "@/lib/settings";

const heading = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400"
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanaticspeedteam.vercel.app"),
  title: "Fanatic Summer Car Show",
  description: "Oficjalna strona wydarzenia Fanatic Summer Car Show.",
  openGraph: {
    title: "Fanatic Summer Car Show",
    description: "Oficjalna strona wydarzenia Fanatic Summer Car Show.",
    url: "/",
    siteName: "Fanatic Speed Team",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanatic Summer Car Show",
    description: "Oficjalna strona wydarzenia Fanatic Summer Car Show."
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getCachedSettings();

  return (
    <html lang="pl">
      <body className={`${heading.variable} ${body.variable}`}>
        <SiteHeader eventName={settings.eventName} />
        <main className="container page">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
