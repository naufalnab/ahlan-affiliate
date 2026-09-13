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
          Ukur kontribusi jaringan referral terhadap akuisisi peserta baru, pendapatan bruto, dan biaya komisi.
        </p>
      </div>

      <div className="grid kpis" style={{ marginTop: 24 }}>
        {[
          ["Total Affiliate", affiliatesCount],
          ["Total Referral", leadsCount],
          ["Peserta Lunas", paidCount],
          ["Conversion Rate", `${conversionRate}%`],
          ["Revenue Referral", money(revenue)],
          ["Biaya Komisi Affiliate", money(affiliateCost)],
          ["Net Revenue (Bersih)", money(netRevenue)],
        ].map(([label, val]) => (
          <div className="card" key={String(label)}>
            <p className="muted">{label}</p>
            <p className="metric">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: 24 }}>
        <section className="card">
          <p className="eyebrow">Analisis Pertumbuhan</p>
          <h2 style={{ margin: "6px 0 10px" }}>Mengubah rekomendasi menjadi channel akuisisi yang terukur</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Mitra affiliate Naufal menyumbang conversion rate yang solid. Program Ammiyah Saudi Arabia mencatat volume referral terbesar. Dengan sistem komisi berbasis hasil (success-fee), margin program tetap sehat dan terprediksi.
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
            Simulasikan proyeksi pendaftar, pendapatan kotor, alokasi komisi, dan laba bersih sebelum merilis skema affiliate ke publik.
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
