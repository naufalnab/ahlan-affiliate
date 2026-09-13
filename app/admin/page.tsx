import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { money } from "@/lib/format";
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
    paidCommission,
    recentLeads,
  } = await repo.getOverview();

  const metrics = [
    ["Total Affiliate", totalAffiliates],
    ["Total Referral", totalLeads],
    ["Peserta Lunas", paidLeads],
    ["Conversion Rate", `${conversionRate}%`],
    ["Komisi Berjalan", money(pendingCommission)],
    ["Komisi Dibayar", money(paidCommission)],
  ];

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Dashboard</p>
        <h1>Dashboard Affiliate Ahlan</h1>
        <p className="muted">
          Ketahui siapa yang membawa calon peserta dan kapan komisi perlu dibayarkan.
        </p>
      </div>

      <div className="grid kpis">
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
          Kelola Affiliate
        </Link>
        <Link className="btn alt" href="/admin/commissions">
          Komisi Pending
        </Link>
        <Link className="btn alt" href="/management/simulator">
          Buka Simulator
        </Link>
      </div>

      <div className="grid two">
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Lead terbaru</h2>
            <Link className="small" href="/admin/leads">
              Lihat semua →
            </Link>
          </div>
          {recentLeads.map((l) => (
            <Link href={`/admin/leads/${l.id}`} className="statline" key={l.id}>
              <span>
                <b>{l.name}</b>
                <br />
                <span className="small muted">
                  {l.program?.name || "Program Ahlan"} · {l.affiliate?.name || "Tanpa affiliate"}
                </span>
              </span>
              <span className={`badge ${l.status}`}>{String(l.status).replaceAll("_", " ")}</span>
            </Link>
          ))}
        </section>

        <section className="card">
          <p className="eyebrow">Insight bulan ini</p>
          <h2>Referral yang dikelola dengan baik punya dampak nyata.</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            Program Ammiyah Saudi Arabia menerima referral terbanyak. Sebanyak {paidLeads} dari {totalLeads} lead referral telah menyelesaikan pembayaran.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className="btn alt" href="/management">
              Lihat Insight Manajemen
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
