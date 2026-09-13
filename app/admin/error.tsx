"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AdminShell } from "@/components/ui";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin area error:", error);
  }, [error]);

  return (
    <AdminShell>
      <div className="card" style={{ maxWidth: 640, margin: "40px auto", textAlign: "center", padding: 32 }}>
        <p className="eyebrow">Status Dashboard</p>
        <h2>Dashboard tidak dapat dimuat</h2>
        <p className="muted">
          Terjadi kesalahan saat memproses data admin. Anda dapat mencoba memuat ulang data atau mereset demo.
        </p>
        <div className="actions" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="btn" onClick={() => reset()}>
            Coba Lagi
          </button>
          <Link className="btn alt" href="/demo">
            Panduan Demo
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
