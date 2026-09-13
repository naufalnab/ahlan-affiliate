import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { date, money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Leads() {
  const repo = await getRepository();
  const leads = await repo.getLeads();
  const programs = await repo.getPrograms();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Calon peserta</p>
        <h1>Kelola Lead Referral ({leads.length})</h1>
        <p className="muted">Cari, lihat status, dan tindak lanjuti calon peserta.</p>
      </div>

      <div className="tablewrap" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Nama Calon Peserta</th>
              <th>Program</th>
              <th>Affiliate</th>
              <th>Tanggal Masuk</th>
              <th>Status</th>
              <th>Komisi</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const comm = l.commissions?.[0];
              return (
                <tr key={l.id}>
                  <td>
                    <Link href={`/admin/leads/${l.id}`} style={{ textDecoration: "none" }}>
                      <b>{l.name}</b>
                      <br />
                      <span className="small muted">{l.phone}</span>
                    </Link>
                  </td>
                  <td>{l.program?.name || "—"}</td>
                  <td>{l.affiliate?.name || "— (Direct)"}</td>
                  <td>{date(l.createdAt)}</td>
                  <td>
                    <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                  </td>
                  <td>
                    {comm ? (
                      <span style={{ fontWeight: 600, color: comm.status === "PAID" ? "#167043" : "#8b6828" }}>
                        {money(comm.amount)} ({comm.status})
                      </span>
                    ) : (
                      <span className="muted">Menunggu</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
