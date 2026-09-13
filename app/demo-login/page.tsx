import Link from "next/link";
import AhlanLogo from "@/components/brand/AhlanLogo";
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
      className="shell section"
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 48,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ============================================================ */}
        {/* INTRO SECTION: 100% CENTER-ALIGNED (Logo, Eyebrow, H1, Desc, Flow) */}
        {/* ============================================================ */}
        <header
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link
            href="/"
            aria-label="Kembali ke Beranda Ahlan"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <AhlanLogo size="lg" priority />
          </Link>

          <p
            className="eyebrow"
            style={{
              textAlign: "center",
              margin: "0 0 8px",
              color: "#8b6828",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            EKSPLORASI DEMO
          </p>

          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 34px)",
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
              margin: "0 auto 12px",
              fontWeight: 800,
              color: "#193830",
              textAlign: "center",
              maxWidth: 580,
            }}
          >
            Lihat Ahlan Affiliate dari
            <br />
            Tiga Sudut Pandang
          </h1>

          <p
            className="lead"
            style={{
              margin: "0 auto 20px",
              maxWidth: 540,
              fontSize: 15.5,
              lineHeight: 1.6,
              color: "#53665e",
              textAlign: "center",
            }}
          >
            Jelajahi sistem sebagai Admin Ahlan, Affiliate, atau Manajemen.
            <br />
            Tidak memerlukan akun atau kata sandi.
          </p>

          {/* Connected-Flow Indicator: Centered */}
          <div
            className="flow-pill-container"
            style={{
              margin: "0 auto 24px",
              textAlign: "center",
            }}
          >
            <span
              className="eyebrow"
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#8b6828",
                margin: 0,
                textAlign: "center",
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
        </header>

        {/* ============================================================ */}
        {/* ROLE CARDS: 100% LEFT-ALIGNED INTERNAL CONTENT               */}
        {/* ============================================================ */}
        <DemoLoginClient nextPath={nextPath} requiredRole={requiredRole} />

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/demo"
            className="small muted"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              transition: "color 150ms ease",
              fontSize: 13,
            }}
          >
            ← Kembali ke Panduan Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
