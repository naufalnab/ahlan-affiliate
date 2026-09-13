import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { money } from "@/lib/format";
import { ResetDemoButton } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Management() {
  const repo = await getRepository();
  const {
    affiliatesCount,
    leadsCount,
    paidCount,
    conversionRate,
    revenue,
    affiliateCost,
    netRevenue,
  } = await repo.getManagementMetrics();

  return (
    <main className="shell section">
      <header className="nav">
        <Link href="/">
          <img className="logo" src="/brand/logo-ahlan.svg" alt="Ahlan" />
        </Link>
        <div className="actions">
          <ResetDemoButton compact />
          <Link className="btn alt" href="/management/simulator">
            Buka Simulator
          </Link>
          <Link className="btn alt" href="/demo-login">
            Ganti Peran
          </Link>
        </div>
      </header>

      <div style={{ marginTop: 24 }}>
        <p className="eyebrow">Executive Management View · Prototype / Demo</p>
        <h1>Dampak Affiliate Terhadap Pertumbuhan</h1>
        <p className="lead">
          Ukur kontribusi jaringan referral terhadap akuisisi peserta baru, pendapatan bruto program, dan efisiensi biaya komisi.
        </p>
      </div>

      <div className="grid kpis" style={{ marginTop: 24, gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="card">
          <p className="muted">Total Affiliate</p>
          <p className="metric">{affiliatesCount}</p>
          <span className="small muted">Mitra aktif terdaftar</span>
        </div>
        <div className="card">
          <p className="muted">Total Referral</p>
          <p className="metric">{leadsCount}</p>
          <span className="small muted">Calon peserta masuk</span>
        </div>
        <div className="card">
          <p className="muted">Peserta Lunas</p>
          <p className="metric">{paidCount}</p>
          <span className="small muted">Pembayaran diverifikasi</span>
        </div>
        <div className="card">
          <p className="muted">Tingkat Konversi</p>
          <p className="metric">{conversionRate}%</p>
          <span className="small muted">Rasio lunas terhadap total lead</span>
        </div>
      </div>

      <div className="grid kpis" style={{ marginTop: 16, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card">
          <p className="muted">Pendapatan Referral</p>
          <p className="metric" style={{ color: "#0d5c4d" }}>{money(revenue)}</p>
          <span className="small muted">Total nilai program peserta referral yang sudah lunas</span>
        </div>
        <div className="card">
          <p className="muted">Biaya Komisi</p>
          <p className="metric" style={{ color: "#8b6828" }}>{money(affiliateCost)}</p>
          <span className="small muted">Total komisi yang telah diterbitkan</span>
        </div>
        <div className="card">
          <p className="muted">Pendapatan Bersih</p>
          <p className="metric" style={{ color: "#167043" }}>{money(netRevenue)}</p>
          <span className="small muted">Pendapatan referral setelah alokasi komisi</span>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 24 }}>
        <section className="card">
          <p className="eyebrow">Analisis Pertumbuhan</p>
          <h2 style={{ margin: "6px 0 10px" }}>Mengubah rekomendasi menjadi channel akuisisi yang terukur</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Mitra affiliate Naufal menyumbang conversion rate yang solid. Program Ammiyah Saudi Arabia mencatat volume referral terbesar. Dengan sistem komisi berbasis hasil (success-fee), margin program tetap sehat, terprediksi, dan transparan.
          </p>
          <div style={{ marginTop: 18 }}>
            <Link className="btn alt" href="/admin">
              Buka Dashboard Operasional Admin →
            </Link>
          </div>
        </section>

        <section className="card">
          <p className="eyebrow">Perencanaan Finansial</p>
          <h2 style={{ margin: "6px 0 10px" }}>Uji kelayakan unit ekonomi program</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Simulasikan proyeksi pendaftar, pendapatan kotor, alokasi biaya komisi, dan margin bersih sebelum merilis skema promo affiliate ke publik.
          </p>
          <div style={{ marginTop: 18 }}>
            <Link className="btn" href="/management/simulator">
              Simulasikan Program Sekarang →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
