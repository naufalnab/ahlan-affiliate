import Link from "next/link";
import DemoLoginClient from "./demo-login-client";

export const dynamic = "force-dynamic";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>;
}) {
  const resolvedParams = await searchParams;
  const nextPath = resolvedParams?.next;
  const requiredRole = resolvedParams?.role;

  return (
    <main
      className="shell center section"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 36,
        paddingBottom: 40,
      }}
    >
      <Link href="/" aria-label="Kembali ke Beranda Ahlan">
        <img
          className="logo"
          src="/brand/logo-ahlan.svg"
          alt="Ahlan Affiliate"
          style={{
            display: "block",
            margin: "0 auto 12px",
            width: 195,
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Link>
      <p className="eyebrow" style={{ margin: "0 0 6px" }}>
        EKSPLORASI DEMO
      </p>
      <h1
        style={{
          fontSize: 30,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          margin: "0 0 10px",
          fontWeight: 800,
        }}
      >
        Lihat Ahlan Affiliate dari Tiga Sudut Pandang
      </h1>
      <p
        className="lead"
        style={{
          margin: "0 auto 18px",
          maxWidth: 580,
          fontSize: 15,
          lineHeight: 1.6,
          color: "#53665e",
        }}
      >
        Jelajahi sistem sebagai Admin Ahlan, Affiliate, atau Manajemen. Tidak memerlukan akun atau kata sandi.
      </p>

      {/* Subtle Connected-Flow Indicator */}
      <div className="flow-pill-container">
        <span
          className="eyebrow"
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "#8b6828",
            margin: 0,
          }}
        >
          ALUR PROGRAM AFFILIATE
        </span>
        <div className="flow-pill-steps">
          <span>Referral</span>
          <span className="flow-pill-arrow">→</span>
          <span>Pendaftaran</span>
          <span className="flow-pill-arrow">→</span>
          <span>Pembayaran</span>
          <span className="flow-pill-arrow">→</span>
          <span>Komisi</span>
          <span className="flow-pill-arrow">→</span>
          <span>Analitik</span>
        </div>
      </div>

      <DemoLoginClient nextPath={nextPath} requiredRole={requiredRole} />

      <div style={{ marginTop: 22 }}>
        <Link
          href="/demo"
          className="small muted"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            transition: "color 150ms ease",
          }}
        >
          ← Kembali ke Panduan Demo
        </Link>
      </div>
    </main>
  );
}
