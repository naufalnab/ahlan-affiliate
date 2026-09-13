"use client";

import Link from "next/link";
import { useEffect } from "react";
import AhlanLogo from "@/components/brand/AhlanLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught exception:", error);
  }, [error]);

  return (
    <main className="shell section center" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ marginBottom: 16 }}>
        <AhlanLogo size="lg" priority />
      </div>
      <p className="eyebrow">Pemulihan Sistem</p>
      <h1>Halaman Belum Dapat Dimuat</h1>
      <p className="lead">
        Terjadi kendala saat memproses data demo. Silakan muat ulang atau kembali ke panduan demo.
      </p>
      <div className="actions" style={{ justifyContent: "center", marginTop: 18 }}>
        <button className="btn" onClick={() => reset()}>
          Muat Ulang Halaman
        </button>
        <Link className="btn alt" href="/demo">
          Buka Panduan Demo
        </Link>
      </div>
    </main>
  );
}
