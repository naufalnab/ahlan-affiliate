import { notFound } from "next/navigation";
import { getRepository } from "@/lib/repository";
import { appUrl, date, money } from "@/lib/format";
import { conversion, labels, maskPhone } from "@/lib/domain";
import { AdminShell, CopyButton } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AffiliateDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = await getRepository();
  const a = await repo.getAffiliateById(id);

  if (!a) {
    notFound();
  }

  const paid = a.leads.filter((l) => l.status === "LUNAS").length;
  const total = a.commissions.reduce((s, c) => s + c.amount, 0);
  const paidMoney = a.commissions.filter((c) => c.status === "PAID").reduce((s, c) => s + c.amount, 0);
  const url = `${appUrl()}/daftar?ref=${a.code}`;

  return (
    <AdminShell>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/affiliates" className="btn alt" style={{ padding: "6px 12px", fontSize: 12, minHeight: 36 }}>
          <ArrowLeft size={14} /> Kembali ke Daftar Affiliate
        </Link>
      </div>

      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 4px" }}>Detail Mitra Affiliate</p>
        <h1 style={{ margin: "2px 0 6px", wordBreak: "break-word" }}>{a.name}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Bergabung {date(a.createdAt)} · Kode: <code>{a.code}</code> {a.phone ? `· WA: ${maskPhone(a.phone)}` : ""}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid kpis" style={{ marginTop: 16 }}>
        {[
          ["Klik Link", a.clicks, "Total kunjungan"],
          ["Calon Peserta", a.leads.length, "Lead referral"],
          ["Sudah Lunas", paid, "Peserta resmi"],
          ["Conversion Rate", `${conversion(paid, a.leads.length)}%`, "Tingkat konversi"],
          ["Total Komisi", money(total), "Hak komisi"],
          ["Sudah Dibayar", money(paidMoney), "Telah ditransfer"],
        ].map(([label, val, sub]) => (
          <div className="card kpi" key={String(label)}>
            <p className="muted" style={{ fontSize: 12, minHeight: 32 }}>{label}</p>
            <p className="metric" style={{ margin: "6px 0 2px" }}>{val}</p>
            {sub && <p className="muted" style={{ fontSize: 11, margin: 0 }}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* Referral Link & QR Code: 2 cols desktop, 1 col mobile */}
      <div className="grid two" style={{ marginTop: 20 }}>
        <section className="card">
          <p className="eyebrow" style={{ margin: "0 0 6px" }}>Tautan Referral</p>
          <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>Link pendaftaran unik mitra</h2>
          <p className="muted" style={{ wordBreak: "break-all", marginBottom: 16, fontSize: 13, background: "#f8f9f7", padding: "8px 12px", borderRadius: 8 }}>
            {url}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <CopyButton text={url} />
            </div>
            <a
              className="btn alt"
              href={`https://wa.me/?text=${encodeURIComponent(
                `Assalamu’alaikum, daftar program Ahlan melalui link referral: ${url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, minWidth: 160, minHeight: 44, fontSize: 13 }}
            >
              <MessageCircle size={15} color="#167043" />
              <span>Bagikan via WA</span>
            </a>
          </div>
        </section>

        <section className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <QRCodeSVG value={url} size={130} />
          <p className="muted" style={{ marginTop: 12, fontSize: 13, marginBottom: 0 }}>
            Scan QR untuk langsung mendaftar via {a.name}.
          </p>
        </section>
      </div>

      {/* Referral History Section */}
      <section className="section" style={{ padding: "32px 0 0" }}>
        <h2 style={{ fontSize: 20, margin: "0 0 12px" }}>Riwayat Referral ({a.leads.length})</h2>

        {/* Desktop Table View (>= 768px) */}
        <div className="tablewrap desktop-table-view">
          <table>
            <thead>
              <tr>
                <th>Calon Peserta</th>
                <th>Program</th>
                <th>Tanggal Masuk</th>
                <th>Status</th>
                <th>Komisi</th>
              </tr>
            </thead>
            <tbody>
              {a.leads.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24 }} className="muted">
                    Belum ada calon peserta melalui mitra ini.
                  </td>
                </tr>
              ) : (
                a.leads.map((l) => {
                  const comm = l.commissions?.[0] || a.commissions.find((c) => c.leadId === l.id);
                  return (
                    <tr key={l.id}>
                      <td>
                        <Link href={`/admin/leads/${l.id}`}>
                          <b style={{ color: "#193830" }}>{l.name}</b>
                          <br />
                          <span className="small muted">{l.phone}</span>
                        </Link>
                      </td>
                      <td>{l.program?.name || "Program Ahlan"}</td>
                      <td>{date(l.createdAt)}</td>
                      <td>
                        <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                      </td>
                      <td>
                        {comm ? (
                          <span style={{ fontWeight: 600, color: comm.status === "PAID" ? "#167043" : "#8b6828" }}>
                            {money(comm.amount)} ({labels[comm.status] || comm.status})
                          </span>
                        ) : (
                          <span className="muted">Menunggu</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< 768px) */}
        <div className="mobile-cards-view">
          {a.leads.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 20 }}>
              <p className="muted" style={{ margin: 0 }}>Belum ada calon peserta melalui mitra ini.</p>
            </div>
          ) : (
            a.leads.map((l) => {
              const comm = l.commissions?.[0] || a.commissions.find((c) => c.leadId === l.id);
              return (
                <div key={l.id} className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <b style={{ fontSize: 15, color: "#193830" }}>{l.name}</b>
                      <span style={{ fontSize: 12, color: "#69766f", display: "block" }}>{maskPhone(l.phone)}</span>
                    </div>
                    <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#374c43" }}>
                    <span>{l.program?.name || "Program Ahlan"}</span> · <span className="muted">{date(l.createdAt)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #edf0ec", paddingTop: 8 }}>
                    <span style={{ fontSize: 12, color: "#69766f" }}>Komisi:</span>
                    {comm ? (
                      <span style={{ fontWeight: 700, color: comm.status === "PAID" ? "#167043" : "#8b6828", fontSize: 13 }}>
                        {money(comm.amount)}
                      </span>
                    ) : (
                      <span className="muted" style={{ fontSize: 12 }}>Menunggu</span>
                    )}
                  </div>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="btn alt"
                    style={{ width: "100%", justifyContent: "center", fontSize: 12, minHeight: 38, padding: "6px 12px", marginTop: 2 }}
                  >
                    <span>Detail Lead</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>
    </AdminShell>
  );
}
