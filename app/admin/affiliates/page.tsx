import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { appUrl, money } from "@/lib/format";
import { conversion, maskPhone } from "@/lib/domain";
import { AdminShell, CopyButton } from "@/components/ui";
import AddAffiliate from "./new-affiliate";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Affiliates() {
  const repo = await getRepository();
  const affiliates = await repo.getAffiliates();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Partnership</p>
        <h1 style={{ margin: "0 0 8px" }}>Mitra Affiliate Ahlan ({affiliates.length})</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
          Kelola mitra, tautan referral, dan kinerja konversi peserta.
        </p>
      </div>

      <AddAffiliate />

      {/* Desktop Table View (>= 768px) */}
      <div className="tablewrap desktop-table-view" style={{ marginTop: 20 }}>
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
                      <b style={{ color: "#193830" }}>{a.name}</b>
                      {a.phone && <span className="small muted"><br />{a.phone}</span>}
                    </Link>
                  </td>
                  <td>
                    <code style={{ background: "#edf4ee", padding: "3px 6px", borderRadius: 6, fontWeight: 700, color: "#0d5c4d" }}>
                      {a.code}
                    </code>
                  </td>
                  <td>{a.clicks}</td>
                  <td>{a.leads.length}</td>
                  <td>{paid}</td>
                  <td>{conversion(paid, a.leads.length)}%</td>
                  <td>
                    <b style={{ color: "#0d5c4d" }}>{money(com)}</b>
                    <br />
                    <a
                      className="small"
                      href={referralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#8b6828", textDecoration: "underline" }}
                    >
                      Form Referral ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (< 768px) */}
      <div className="mobile-cards-view" style={{ marginTop: 16 }}>
        {affiliates.map((a) => {
          const paid = a.leads.filter((x) => x.status === "LUNAS").length;
          const com = a.leads.flatMap((x) => x.commissions || []).reduce((s, x) => s + x.amount, 0);
          const referralUrl = `${appUrl()}/daftar?ref=${a.code}`;

          return (
            <div
              key={a.id}
              className="card"
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Header: Name & Code */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <b style={{ fontSize: 16, color: "#193830", display: "block" }}>{a.name}</b>
                  {a.phone && (
                    <span style={{ fontSize: 13, color: "#69766f", display: "block", marginTop: 2 }}>
                      WA: {maskPhone(a.phone)}
                    </span>
                  )}
                </div>
                <code
                  style={{
                    background: "#edf4ee",
                    color: "#0d5c4d",
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {a.code}
                </code>
              </div>

              {/* 4-Metric Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 6,
                  background: "#f8f9f7",
                  padding: "10px 8px",
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Klik</span>
                  <b style={{ fontSize: 14, color: "#193830" }}>{a.clicks}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Lead</span>
                  <b style={{ fontSize: 14, color: "#193830" }}>{a.leads.length}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Lunas</span>
                  <b style={{ fontSize: 14, color: "#167043" }}>{paid}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Konversi</span>
                  <b style={{ fontSize: 14, color: "#8b6828" }}>{conversion(paid, a.leads.length)}%</b>
                </div>
              </div>

              {/* Total Komisi row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #edf0ec", paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: "#69766f" }}>Total Komisi:</span>
                <b style={{ fontSize: 15, color: "#0d5c4d" }}>{money(com)}</b>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <Link
                  href={`/admin/affiliates/${a.id}`}
                  className="btn alt"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    fontSize: 13,
                    minHeight: 44,
                    padding: "8px 12px",
                  }}
                >
                  <span>Detail Mitra</span>
                  <ChevronRight size={14} />
                </Link>
                <div style={{ flex: 1 }}>
                  <CopyButton text={referralUrl} label="Salin Link" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
