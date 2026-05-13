"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: ReadonlyArray<{ href: any; label: string }> = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/practice/123", label: "My Shed" },
  { href: "/student/core", label: "Curriculum" },
  { href: "/quiz", label: "Goals" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            GM
          </span>
          <span className="brand-copy">
            <span className="brand-name">Guitarmalade</span>
            <span className="brand-subtitle">SAUCE practice system</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="site-nav">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                className={`site-nav-link${active ? " site-nav-link-active" : ""}`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-avatar" aria-hidden="true" />
      </div>
    </header>
  );
}
