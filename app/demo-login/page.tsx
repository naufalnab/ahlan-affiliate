import Link from "next/link";
import { ArrowRight, LayoutDashboard, UserCheck, BarChart3 } from "lucide-react";

export default function Login() {
  return (
    <main className="shell center section" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
        Tidak memerlukan login atau kata sandi. Masuk langsung ke salah satu peran untuk menguji fungsionalitas aplikasi.
      </p>

      <div className="grid" style={{ gap: 16, textAlign: "left", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <Link
          className="card"
          href="/admin"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            transition: "all 0.2s ease",
            borderColor: "#d5ddd7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Admin Operasional</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Kelola calon peserta (Suyadi), update status lunas, verifikasi komisi, dan kelola mitra.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="#0d5c4d" />
        </Link>

        <Link
          className="card"
          href="/affiliate"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            transition: "all 0.2s ease",
            borderColor: "#d5ddd7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Affiliate Naufal</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Pantau tautan unik NAUFAL, QR code, calon peserta yang masuk, dan saldo komisi.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="#0d5c4d" />
        </Link>

        <Link
          className="card"
          href="/management"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            transition: "all 0.2s ease",
            borderColor: "#d5ddd7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Executive Management</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Tinjau performa akuisisi program, total revenue, rasio konversi, dan simulator proyeksi.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="#0d5c4d" />
        </Link>
      </div>

      <div style={{ marginTop: 28 }}>
        <Link href="/demo" className="small muted">
          ← Kembali ke Panduan Demo Alur Lengkap
        </Link>
      </div>
    </main>
  );
}
