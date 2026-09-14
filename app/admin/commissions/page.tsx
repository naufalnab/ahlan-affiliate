import { getRepository } from "@/lib/repository";
import { date, money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";
import CommissionActions from "./commission-actions";

export const dynamic = "force-dynamic";

export default async function Commissions() {
  const repo = await getRepository();
  const commissions = await repo.getCommissions();

  const total = commissions.filter((c) => c.status !== "CANCELLED").reduce((sum, c) => sum + c.amount, 0);
  const pending = commissions.filter((c) => c.status === "PENDING").reduce((sum, c) => sum + c.amount, 0);
  const approved = commissions.filter((c) => c.status === "APPROVED").reduce((sum, c) => sum + c.amount, 0);
  const paid = commissions.filter((c) => c.status === "PAID").reduce((sum, c) => sum + c.amount, 0);

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Pembayaran mitra</p>
        <h1 style={{ margin: "0 0 8px" }}>Komisi Affiliate ({commissions.length})</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
          Setujui hak komisi referral dan catat penyaluran dana komisi secara transparan.
        </p>
      </div>

      {/* KPI Grid: responsive 4 cols desktop, 2 cols tablet/mobile, 1 col micro-mobile */}
      <div className="grid kpis" style={{ margin: "16px 0 20px" }}>
        <div className="card kpi">
          <p className="muted" style={{ fontSize: 12, minHeight: 32 }}>Total Komisi Terbit</p>
          <p className="metric">{money(total)}</p>
        </div>
        <div className="card kpi">
          <p className="muted" style={{ fontSize: 12, minHeight: 32 }}>Menunggu Persetujuan</p>
          <p className="metric" style={{ color: "#916316" }}>{money(pending)}</p>
        </div>
        <div className="card kpi">
          <p className="muted" style={{ fontSize: 12, minHeight: 32 }}>Siap Dibayar (Disetujui)</p>
          <p className="metric" style={{ color: "#8b6828" }}>{money(approved)}</p>
        </div>
        <div className="card kpi">
          <p className="muted" style={{ fontSize: 12, minHeight: 32 }}>Sudah Ditransfer</p>
          <p className="metric" style={{ color: "#167043" }}>{money(paid)}</p>
        </div>
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="tablewrap desktop-table-view">
        <table>
          <thead>
            <tr>
              <th>Affiliate</th>
              <th>Nama Peserta</th>
              <th>Program</th>
              <th>Jumlah Komisi</th>
              <th>Tanggal Terbit</th>
              <th>Status</th>
              <th>Aksi Admin</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id}>
                <td>
                  <b style={{ color: "#193830" }}>{c.affiliate?.name || "Affiliate"}</b>
                  <br />
                  <span className="small muted">Kode: <code>{c.affiliate?.code}</code></span>
                </td>
                <td>{c.lead?.name || "Calon Peserta"}</td>
                <td>{c.lead?.program?.name || "Program Ahlan"}</td>
                <td>
                  <b style={{ color: "#0d5c4d" }}>{money(c.amount)}</b>
                </td>
                <td>
                  {date(c.generatedAt)}
                  {c.approvedAt && (
                    <span className="small muted" style={{ display: "block" }}>
                      Disetujui: {date(c.approvedAt)}
                    </span>
                  )}
                  {c.paidAt && (
                    <span className="small muted" style={{ display: "block", color: "#167043" }}>
                      Dibayar: {date(c.paidAt)}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${c.status}`}>
                    {labels[c.status] || c.status}
                  </span>
                </td>
                <td>
                  <CommissionActions id={c.id} status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (< 768px) */}
      <div className="mobile-cards-view">
        {commissions.map((c) => (
          <div
            key={c.id}
            className="card"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Header: Affiliate & Amount */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: "#8b6828", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Mitra Affiliate
                </span>
                <b style={{ fontSize: 16, color: "#193830", display: "block" }}>
                  {c.affiliate?.name || "Affiliate"}
                </b>
                <span style={{ fontSize: 12, color: "#69766f" }}>
                  Kode: <code>{c.affiliate?.code}</code>
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Nominal</span>
                <b style={{ fontSize: 18, color: "#0d5c4d" }}>{money(c.amount)}</b>
              </div>
            </div>

            {/* Details */}
            <div style={{ background: "#f8f9f7", padding: "10px 12px", borderRadius: 10, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
              <div>
                <span className="muted">Calon Peserta:</span> <b>{c.lead?.name || "Calon Peserta"}</b>
              </div>
              <div>
                <span className="muted">Program:</span> <b>{c.lead?.program?.name || "Program Ahlan"}</b>
              </div>
              <div style={{ fontSize: 12, color: "#69766f", marginTop: 2 }}>
                <span>Terbit: {date(c.generatedAt)}</span>
                {c.approvedAt && <span> · Disetujui: {date(c.approvedAt)}</span>}
                {c.paidAt && <span style={{ color: "#167043", fontWeight: 600 }}> · Dibayar: {date(c.paidAt)}</span>}
              </div>
            </div>

            {/* Status & Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #edf0ec", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#69766f" }}>Status Komisi:</span>
                <span className={`badge ${c.status}`}>
                  {labels[c.status] || c.status}
                </span>
              </div>

              <CommissionActions id={c.id} status={c.status} fullWidth />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
