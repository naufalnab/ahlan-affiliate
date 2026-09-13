import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { appUrl, money } from "@/lib/format";
import { conversion } from "@/lib/domain";
import { AdminShell } from "@/components/ui";
import AddAffiliate from "./new-affiliate";

export const dynamic = "force-dynamic";

export default async function Affiliates() {
  const repo = await getRepository();
  const affiliates = await repo.getAffiliates();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Partnership</p>
        <h1>Mitra Affiliate Ahlan ({affiliates.length})</h1>
        <p className="muted">Kelola mitra, tautan referral, dan kinerja konversi peserta.</p>
      </div>

      <AddAffiliate />

      <div className="tablewrap" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Nama Mitra</th>
              <th>Kode Referral</th>
              <th>Klik Link</th>
              <th>Total Lead</th>
              <th>Peserta Lunas</th>
              <th>Conversion</th>
              <th>Total Komisi</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((a) => {
              const paid = a.leads.filter((x) => x.status === "LUNAS").length;
              const com = a.leads.flatMap((x) => x.commissions || []).reduce((s, x) => s + x.amount, 0);
              const referralUrl = `${appUrl()}/daftar?ref=${a.code}`;

              return (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/affiliates/${a.id}`}>
                      <b>{a.name}</b>
                      {a.phone && <span className="small muted"><br />{a.phone}</span>}
                    </Link>
                  </td>
                  <td>
                    <code>{a.code}</code>
                  </td>
                  <td>{a.clicks}</td>
                  <td>{a.leads.length}</td>
                  <td>{paid}</td>
                  <td>{conversion(paid, a.leads.length)}%</td>
                  <td>
                    <b>{money(com)}</b>
                    <br />
                    <a
                      className="small"
                      href={referralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0d5c4d" }}
                    >
                      Buka Form Referral ↗
                    </a>
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
