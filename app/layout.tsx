import "./globals.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ahlan Affiliate — Sistem Referral Ahlan",
  description: "Prototype sistem referral dan affiliate Ahlan Les Bahasa Arab.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    title: "Ahlan Affiliate — Sistem Referral Ahlan",
    description: "Prototype sistem referral dan affiliate Ahlan Les Bahasa Arab.",
    images: ["/brand/ahlan-logo-cropped.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

