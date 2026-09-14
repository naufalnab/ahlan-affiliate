import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";
import { Calculator, Handshake, Users, WalletCards } from "lucide-react";

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
    ["Total Mitra Affiliate", totalAffiliates, "Mitra aktif"],
    ["Total Calon Peserta", totalLeads, "Semua jalur"],
    ["Peserta Lunas", paidLeads, `${conversionRate}% konversi`],
    ["Tingkat Konversi", `${conversionRate}%`, "Lead jadi siswa"],
    ["Pendapatan Referral", money(revenue), "Nilai kotor pendaftaran"],
    ["Komisi Menunggu Persetujuan", money(pendingCommission), "Perlu verifikasi admin"],
    ["Komisi Siap Dibayar", money(approvedCommission), "Telah disetujui"],
    ["Komisi Sudah Ditransfer", money(paidCommission), "Selesai dibayar"],
  ];

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Dashboard Operasional</p>
        <h1 style={{ margin: "0 0 8px", maxWidth: "100%" }}>Dashboard Affiliate Ahlan</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5, maxWidth: 680 }}>
          Ketahui siapa mitra yang membawa calon peserta dan pantau tahapan verifikasi komisi secara transparan.
        </p>
      </div>

      {/* KPI Grid: 4 cols desktop, 2 cols tablet/mobile, 1 col micro-mobile */}
      <div className="grid kpis" style={{ marginTop: 16 }}>
        {metrics.map(([label, val, sub]) => (
          <div className="card kpi" key={String(label)}>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.35, minHeight: 32 }}>
              {label}
            </p>
            <p className="metric" style={{ margin: "6px 0 2px" }}>
              {val}
            </p>
            {sub && (
              <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions: 4 cols desktop, 2 cols mobile, 1 col <=360px */}
      <div className="admin-action-grid">
        <Link className="btn" href="/admin/leads">
          <Users size={16} />
          <span>Kelola Peserta</span>
        </Link>
        <Link className="btn alt" href="/admin/affiliates">
          <Handshake size={16} />
          <span>Kelola Affiliate</span>
        </Link>
        <Link className="btn alt" href="/admin/commissions">
          <WalletCards size={16} />
          <span>Komisi Pending</span>
        </Link>
        <Link className="btn alt" href="/management/simulator">
          <Calculator size={16} />
          <span>Simulator</span>
        </Link>
      </div>

      {/* 2-column desktop (>=1024px), vertical stack tablet & mobile (<1024px) */}
      <div className="grid two" style={{ marginTop: 8 }}>
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Lead terbaru</h2>
            <Link className="small" href="/admin/leads" style={{ color: "#0d5c4d", fontWeight: 600 }}>
              Lihat semua ({totalLeads}) →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentLeads.map((l) => (
              <Link
                href={`/admin/leads/${l.id}`}
                className="statline"
                key={l.id}
                style={{
                  textDecoration: "none",
                  padding: "12px 0",
                }}
              >
                <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
                  <b style={{ color: "#193830", fontSize: 14, display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {l.name}
                  </b>
                  <span className="small muted" style={{ display: "block", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {l.program?.name || "Program Ahlan"} · {l.affiliate?.name || "Direct"}
                  </span>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span className={`badge ${l.status}`} style={{ fontSize: 11 }}>
                    {labels[l.status] || String(l.status).replaceAll("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <p className="eyebrow" style={{ margin: "0 0 6px" }}>Insight Pertumbuhan</p>
          <h2 style={{ fontSize: 18, margin: "0 0 10px", lineHeight: 1.3 }}>
            Referral yang dikelola dengan baik punya dampak nyata.
          </h2>
          <p className="muted" style={{ lineHeight: 1.6, fontSize: 13.5, margin: "0 0 16px" }}>
            Program Ammiyah Saudi Arabia menerima referral terbanyak. Sebanyak {paidLeads} dari {totalLeads} lead referral telah menyelesaikan pembayaran ({conversionRate}% konversi). Pendapatan referral tercatat {money(revenue)} dengan margin bersih setelah komisi {money(netRevenue)}.
          </p>
          <div>
            <Link className="btn alt" href="/management" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
              Buka Analisis Eksekutif Manajemen →
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
