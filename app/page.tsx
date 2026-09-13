import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Link2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const steps = [
  "Affiliate mendapatkan tautan referal unik (contoh: ref=NAUFAL)",
  "Tautan dibagikan ke calon peserta melalui WhatsApp atau media sosial",
  "Pendaftaran dan sumber referal otomatis tercatat di dashboard",
  "Admin menindaklanjuti status peserta hingga komisi diterbitkan dan ditransfer",
];

export default function Home() {
  return (
    <>
      <header className="shell nav">
        <Link href="/">
          <img className="logo" src="/brand/logo-ahlan.svg" alt="Ahlan Affiliate" />
        </Link>
        <nav className="navlinks">
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#manfaat">Manfaat</a>
          <Link href="/demo">Coba Demo</Link>
          <Link className="btn" href="/demo-login">
            Masuk Demo
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="shell">
            <p className="eyebrow">Referral & Partnership System</p>
            <h1>Dari rekomendasi menjadi pertumbuhan yang terukur.</h1>
            <p className="lead">
              Sistem referral untuk membantu Ahlan mencatat calon peserta, affiliate, pendaftaran, dan komisi dalam satu alur kerja yang rapi dan transparan.
            </p>

            <div className="actions" style={{ marginBottom: 28 }}>
              <Link className="btn" href="/demo">
                <ArrowRight size={17} /> Coba Alur Demo (7 Langkah)
              </Link>
              <Link className="btn alt" href="/demo-login">
                Pilih Peran Demo
              </Link>
            </div>

            {/* Visual Product Preview - First Screen Proof */}
            <div
              className="card"
              style={{
                maxWidth: 760,
                padding: "16px 20px",
                background: "#ffffff",
                border: "1px solid #dce4df",
                boxShadow: "0 6px 20px rgba(18, 59, 51, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Sparkles size={14} color="#c39542" />
                <span className="eyebrow" style={{ fontSize: 11, margin: 0 }}>
                  Alur Rekomendasi Terintegrasi
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ background: "#f8f7f2", padding: "10px 14px", borderRadius: 8, border: "1px solid #edf0ec" }}>
                  <span className="small muted" style={{ display: "block" }}>1. Mitra Affiliate</span>
                  <b>Naufal Nabila</b>
                  <div style={{ marginTop: 2 }}>
                    <code style={{ fontSize: 11, color: "#0d5c4d" }}>ref=NAUFAL</code>
                  </div>
                </div>

                <div style={{ background: "#f8f7f2", padding: "10px 14px", borderRadius: 8, border: "1px solid #edf0ec" }}>
                  <span className="small muted" style={{ display: "block" }}>2. Calon Peserta</span>
                  <b>Suyadi</b>
                  <div style={{ marginTop: 2 }}>
                    <span className="small muted">Ammiyah Saudi</span>
                  </div>
                </div>

                <div style={{ background: "#f8f7f2", padding: "10px 14px", borderRadius: 8, border: "1px solid #edf0ec" }}>
                  <span className="small muted" style={{ display: "block" }}>3. Status & Hak Komisi</span>
                  <span className="badge LUNAS" style={{ display: "inline-block", margin: "2px 0" }}>
                    Lunas
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#167043", marginTop: 2 }}>
                    Komisi Rp75.000 Terbit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section shell">
          <p className="eyebrow">Tantangan Hari Ini</p>
          <h2>Rekomendasi terjadi setiap hari, tetapi hasilnya belum selalu terlihat.</h2>
          <div className="grid cards" style={{ marginTop: 20 }}>
            <article className="card">
              <Link2 color="#0d5c4d" size={24} />
              <h3>Link yang Jelas</h3>
              <p className="muted">Setiap mitra memiliki tautan referal unik dan QR code yang mudah dibagikan.</p>
            </article>
            <article className="card">
              <Users color="#0d5c4d" size={24} />
              <h3>Atribusi Rapi</h3>
              <p className="muted">Ketahui secara akurat siapa yang membawa calon peserta sejak pendaftaran awal.</p>
            </article>
            <article className="card">
              <BarChart3 color="#0d5c4d" size={24} />
              <h3>Progress Terukur</h3>
              <p className="muted">Pantau perjalanan calon peserta dari lead baru hingga pembayaran selesai.</p>
            </article>
            <article className="card">
              <ShieldCheck color="#0d5c4d" size={24} />
              <h3>Komisi Terpercaya</h3>
              <p className="muted">Hak komisi otomatis terhitung saat status pendaftaran telah diverifikasi lunas.</p>
            </article>
          </div>
        </section>

        <section id="cara-kerja" className="section shell">
          <p className="eyebrow">Cara Kerja</p>
          <h2>Sederhana untuk dibagikan, rapi untuk dikelola.</h2>
          <div className="grid flow" style={{ marginTop: 20 }}>
            {steps.map((x, i) => (
              <article className="card" key={x}>
                <span className="eyebrow">0{i + 1}</span>
                <h3 style={{ fontSize: 16, marginTop: 8 }}>{x}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="manfaat" className="section shell">
          <div className="card" style={{ padding: 32 }}>
            <p className="eyebrow">Skenario Nyata</p>
            <h2 style={{ margin: "6px 0 12px" }}>Naufal merekomendasikan Suyadi untuk program Ammiyah Saudi Arabia.</h2>
            <p className="lead" style={{ margin: "0 0 20px" }}>
              Suyadi mendaftar melalui tautan rekomendasi Naufal. Sistem Ahlan langsung mencatat sumber referral Naufal, mengawal tindak lanjut admin, dan mengkreditkan komisi secara otomatis setelah pembayaran lunas.
            </p>
            <div className="actions">
              <Link className="btn" href="/admin/leads">
                Buka Data Demo Peserta
              </Link>
              <Link className="btn alt" href="/affiliate">
                Lihat Portal Naufal
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
