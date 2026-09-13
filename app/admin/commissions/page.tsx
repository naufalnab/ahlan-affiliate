import { getRepository } from "@/lib/repository";
import { date, money } from "@/lib/format";
import { AdminShell } from "@/components/ui";
import CommissionActions from "./commission-actions";

export const dynamic = "force-dynamic";

export default async function Commissions() {
  const repo = await getRepository();
  const commissions = await repo.getCommissions();

  const total = commissions.reduce((sum, c) => sum + c.amount, 0);
  const pending = commissions.filter((c) => c.status !== "PAID").reduce((sum, c) => sum + c.amount, 0);
  const paid = commissions.filter((c) => c.status === "PAID").reduce((sum, c) => sum + c.amount, 0);

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Pembayaran mitra</p>
        <h1>Komisi Affiliate ({commissions.length})</h1>
        <p className="muted">Setujui dan catat pembayaran komisi secara transparan.</p>
      </div>

      <div className="grid kpis" style={{ marginBottom: 20 }}>
        <div className="card kpi">
          <p className="muted">Total Komisi Terbit</p>
          <p className="metric">{money(total)}</p>
        </div>
        <div className="card kpi">
          <p className="muted">Pending / Menunggu Pembayaran</p>
          <p className="metric" style={{ color: "#916316" }}>{money(pending)}</p>
        </div>
        <div className="card kpi">
          <p className="muted">Sudah Ditransfer</p>
          <p className="metric" style={{ color: "#167043" }}>{money(paid)}</p>
        </div>
      </div>

      <div className="tablewrap">
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
                  <b>{c.affiliate?.name || "Affiliate"}</b>
                  <br />
                  <span className="small muted">Kode: {c.affiliate?.code}</span>
                </td>
                <td>{c.lead?.name || "Calon Peserta"}</td>
                <td>{c.lead?.program?.name || "Program Ahlan"}</td>
                <td><b>{money(c.amount)}</b></td>
                <td>{date(c.generatedAt)}</td>
                <td>
                  <span className={`badge ${c.status}`}>
                    {c.status === "PAID" ? "SUDAH DIBAYAR" : c.status === "APPROVED" ? "DISETUJUI" : "PENDING"}
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
    </AdminShell>
  );
}
