import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const repo = await getRepository();
  const {
    totalAffiliates,
    totalLeads,
    paidLeads,
    conversionRate,
    pendingCommission,
    approvedCommission,
    paidCommission,
    revenue,
    netRevenue,
    recentLeads,
  } = await repo.getOverview();

  const metrics = [
    ["Total Mitra Affiliate", totalAffiliates],
    ["Total Calon Peserta", totalLeads],
    ["Peserta Lunas", paidLeads],
    ["Tingkat Konversi", `${conversionRate}%`],
    ["Pendapatan Referral", money(revenue)],
    ["Komisi Menunggu Persetujuan", money(pendingCommission)],
    ["Komisi Siap Dibayar", money(approvedCommission)],
    ["Komisi Sudah Ditransfer", money(paidCommission)],
  ];

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Dashboard Operasional</p>
        <h1>Dashboard Affiliate Ahlan</h1>
        <p className="muted">
          Ketahui siapa mitra yang membawa calon peserta dan pantau tahapan verifikasi komisi secara transparan.
        </p>
      </div>

      <div className="grid kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {metrics.map(([label, val]) => (
          <div className="card kpi" key={String(label)}>
            <p className="muted">{label}</p>
            <p className="metric">{val}</p>
          </div>
        ))}
      </div>

      <div className="actions" style={{ margin: "20px 0" }}>
        <Link className="btn" href="/admin/leads">
          Kelola Calon Peserta
        </Link>
        <Link className="btn alt" href="/admin/affiliates">
          Kelola Mitra Affiliate
        </Link>
        <Link className="btn alt" href="/admin/commissions">
          Komisi Affiliate ({money(pendingCommission + approvedCommission)} berjalan)
        </Link>
        <Link className="btn alt" href="/management/simulator">
          Buka Simulator Ekonomi
        </Link>
      </div>

      <div className="grid two">
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Lead terbaru</h2>
            <Link className="small" href="/admin/leads">
              Lihat semua ({totalLeads}) →
            </Link>
          </div>
          {recentLeads.map((l) => (
            <Link href={`/admin/leads/${l.id}`} className="statline" key={l.id}>
              <span>
                <b>{l.name}</b>
                <br />
                <span className="small muted">
                  {l.program?.name || "Program Ahlan"} · {l.affiliate?.name || "Tanpa affiliate (Direct)"}
                </span>
              </span>
              <span className={`badge ${l.status}`}>{labels[l.status] || String(l.status).replaceAll("_", " ")}</span>
            </Link>
          ))}
        </section>

        <section className="card">
          <p className="eyebrow">Insight Pertumbuhan</p>
          <h2>Referral yang dikelola dengan baik punya dampak nyata.</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Program Ammiyah Saudi Arabia menerima referral terbanyak. Sebanyak {paidLeads} dari {totalLeads} lead referral telah menyelesaikan pembayaran ({conversionRate}% konversi). Pendapatan referral tercatat {money(revenue)} dengan margin bersih setelah komisi {money(netRevenue)}.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className="btn alt" href="/management">
              Buka Analisis Eksekutif Manajemen →
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
