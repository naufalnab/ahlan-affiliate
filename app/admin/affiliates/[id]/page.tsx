import { notFound } from "next/navigation";
import { getRepository } from "@/lib/repository";
import { appUrl, date, money } from "@/lib/format";
import { conversion, labels } from "@/lib/domain";
import { AdminShell, CopyButton } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        <Link href="/admin/affiliates" className="btn alt" style={{ padding: "6px 12px", fontSize: 12 }}>
          <ArrowLeft size={14} /> Kembali ke Daftar Affiliate
        </Link>
      </div>

      <div className="pagehead">
        <p className="eyebrow">Detail Mitra Affiliate</p>
        <h1>{a.name}</h1>
        <p className="muted">
          Bergabung {date(a.createdAt)} · Kode Referral: <code>{a.code}</code> {a.phone ? `· WA: ${a.phone}` : ""}
        </p>
      </div>

      <div className="grid kpis">
        {[
          ["Klik Link", a.clicks],
          ["Calon Peserta", a.leads.length],
          ["Sudah Lunas", paid],
          ["Conversion Rate", `${conversion(paid, a.leads.length)}%`],
          ["Total Komisi", money(total)],
          ["Sudah Dibayar", money(paidMoney)],
        ].map(([label, val]) => (
          <div className="card" key={String(label)}>
            <p className="muted">{label}</p>
            <p className="metric">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: 20 }}>
        <section className="card">
          <p className="eyebrow">Tautan Referral</p>
          <h2 style={{ margin: "6px 0 10px" }}>Link pendaftaran unik mitra</h2>
          <p className="muted" style={{ wordBreak: "break-all", marginBottom: 16 }}>
            {url}
          </p>
          <div className="actions">
            <CopyButton text={url} />
            <a
              className="btn alt"
              href={`https://wa.me/?text=${encodeURIComponent(
                `Assalamu’alaikum, daftar program Ahlan melalui link referral: ${url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Bagikan via WhatsApp
            </a>
          </div>
        </section>

        <section className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <QRCodeSVG value={url} size={130} />
          <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            Scan QR untuk langsung mendaftar via {a.name}.
          </p>
        </section>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <h2>Riwayat Referral ({a.leads.length})</h2>
        <div className="tablewrap" style={{ marginTop: 12 }}>
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
              {a.leads.map((l) => {
                const comm = l.commissions?.[0] || a.commissions.find((c) => c.leadId === l.id);
                return (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/admin/leads/${l.id}`}>
                        <b>{l.name}</b>
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
      </section>
    </AdminShell>
  );
}
