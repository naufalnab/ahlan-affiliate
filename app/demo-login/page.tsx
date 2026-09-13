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
      }}
    >
      <Link href="/">
        <img
          className="logo"
          src="/brand/logo-ahlan.svg"
          alt="Ahlan Affiliate"
          style={{ display: "block", margin: "0 auto 16px" }}
        />
      </Link>
      <p className="eyebrow">Eksplorasi Peran · Prototype / Demo</p>
      <h1 style={{ fontSize: 32, margin: "6px 0 10px" }}>Pilih Pengalaman Demo</h1>
      <p className="lead" style={{ margin: "0 auto 28px", maxWidth: 540 }}>
        Tidak memerlukan akun atau kata sandi. Pilih peran di bawah untuk langsung menguji fungsionalitas dan alur kerja aplikasi.
      </p>

      <DemoLoginClient nextPath={nextPath} requiredRole={requiredRole} />

      <div style={{ marginTop: 28 }}>
        <Link href="/demo" className="small muted">
          ← Kembali ke Panduan Demo Alur Lengkap
        </Link>
      </div>
    </main>
  );
}
