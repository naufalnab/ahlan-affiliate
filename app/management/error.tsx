"use client";

import Link from "next/link";
import { useEffect } from "react";
import AhlanLogo from "@/components/brand/AhlanLogo";

export default function ManagementError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Management portal error:", error);
  }, [error]);

  return (
    <main className="shell section center">
      <header className="nav">
        <Link href="/" aria-label="Beranda Ahlan">
          <AhlanLogo size="md" priority />
        </Link>
        <Link className="btn alt" href="/demo-login">Ganti Demo</Link>
      </header>
      <div className="card" style={{ padding: 32, textAlign: "center", marginTop: 24 }}>
        <p className="eyebrow">Executive Management View</p>
        <h2>Metrik manajemen belum dapat dimuat</h2>
        <p className="muted">
          Terjadi kendala saat menghitung ringkasan ekonomi referral. Silakan coba lagi.
        </p>
        <div className="actions" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="btn" onClick={() => reset()}>
            Muat Ulang
          </button>
          <Link className="btn alt" href="/management/simulator">
            Buka Simulator
          </Link>
        </div>
      </div>
    </main>
  );
}
