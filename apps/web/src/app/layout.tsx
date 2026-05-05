import "./globals.css";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { SiteNav } from "../components/site-nav";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Guitarmalade SAUCE",
  description: "Student-first Guitarmalade practice platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="site-frame">
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  );
}
