"use client";

import Link from "next/link";
import { Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";

const navItems = [
  { href: "/", label: "Strona główna" },
  { href: "/zglos-pojazd", label: "Zgłoś pojazd" },
  { href: "/o-stowarzyszeniu", label: "O stowarzyszeniu" },
  { href: "/zostan-wystawca", label: "Zostań wystawcą" },
  { href: "/wesprzyj", label: "Wesprzyj działania" }
];

export function SiteHeader({ eventName = "Fanatic Summer Car Show" }: { eventName?: string }) {
  return (
    <Navbar expand="lg" collapseOnSelect className="site-header" sticky="top" data-bs-theme="dark">
      <Container className="py-2">
        <NavbarBrand as={Link} href="/" className="brand">
          {eventName}
        </NavbarBrand>
        <NavbarToggle aria-controls="main-nav" />
        <NavbarCollapse id="main-nav" className="justify-content-end">
          <Nav className="gap-lg-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}
