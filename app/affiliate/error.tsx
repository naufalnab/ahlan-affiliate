"use client";

import Link from "next/link";
import { useEffect } from "react";
import AhlanLogo from "@/components/brand/AhlanLogo";

export default function AffiliateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Affiliate portal error:", error);
  }, [error]);

  return (
    <main>
      <header className="shell nav">
        <Link href="/" aria-label="Beranda Ahlan">
          <AhlanLogo size="md" priority />
        </Link>
        <Link className="btn alt" href="/demo-login">Ganti Demo</Link>
      </header>
      <div className="shell section center">
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <p className="eyebrow">Portal Affiliate</p>
          <h2>Data referral belum dapat dimuat</h2>
          <p className="muted">
            Koneksi ke data affiliate sedang dimuat ulang. Silakan klik tombol di bawah untuk mencoba kembali.
          </p>
          <div className="actions" style={{ justifyContent: "center", marginTop: 20 }}>
            <button className="btn" onClick={() => reset()}>
              Muat Ulang Data
            </button>
            <Link className="btn alt" href="/demo">
              Kembali ke Alur Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
