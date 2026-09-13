import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { appUrl, date, money } from "@/lib/format";
import { labels, maskPhone } from "@/lib/domain";
import { CopyButton, ResetDemoButton } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";

export const dynamic = "force-dynamic";

export default async function Affiliate() {
  const repo = await getRepository();
  const data = await repo.getAffiliatePortal("NAUFAL");

  if (!data) {
    return (
      <main className="shell section center">
        <h1>Data affiliate Naufal tidak ditemukan.</h1>
        <Link className="btn" href="/demo">
          Kembali ke Panduan Demo
        </Link>
      </main>
    );
  }

  const { affiliate: a, leads, commissions, totalCommission, registeredCount, paidCount } = data;
  const url = `${appUrl()}/daftar?ref=${a.code}`;

  return (
    <main>
      <header className="shell nav">
        <Link href="/">
          <img className="logo" src="/brand/logo-ahlan.svg" alt="Ahlan" />
        </Link>
        <div className="actions">
          <ResetDemoButton compact />
          <Link className="btn alt" href="/demo">
            Panduan Demo
          </Link>
          <Link className="btn alt" href="/demo-login">
            Ganti Peran
          </Link>
        </div>
      </header>
      <section className="shell section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="eyebrow">Portal Affiliate · Prototype / Demo</p>
            <h1>Assalamu’alaikum, {a.name.split(" ")[0]}</h1>
            <p className="lead">
              Bagikan link Anda. Ahlan menangani pendaftaran dan kelas. Anda dapat memantau konversi dan hasil referral secara transparan.
            </p>
          </div>
        </div>

        <div className="grid kpis" style={{ marginTop: 20 }}>
          {[
            ["Klik Link", a.clicks],
            ["Calon Peserta", leads.length],
            ["Sudah Daftar", registeredCount],
            ["Sudah Lunas", paidCount],
            ["Total Komisi", money(totalCommission)],
          ].map(([label, val]) => (
            <div className="card" key={String(label)}>
              <p className="muted">{label}</p>
              <p className="metric">{val}</p>
            </div>
          ))}
        </div>

        <div className="grid two" style={{ marginTop: 24 }}>
          <section className="card">
            <p className="eyebrow">Link referral Anda</p>
            <h2 style={{ margin: "8px 0" }}>Bagikan dan pantau hasilnya</h2>
            <p className="muted" style={{ wordBreak: "break-all", marginBottom: 16 }}>
              {url}
            </p>
            <div className="actions">
              <CopyButton text={url} />
              <a
                className="btn"
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bismillah, jika sedang mencari kelas Bahasa Arab, bisa melihat program Ahlan melalui tautan ini: ${url}`
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
              Scan QR untuk langsung membuka formulir dengan kode referral <b>{a.code}</b>.
            </p>
          </section>
        </div>

        <section className="section">
          <h2>Referral Saya ({leads.length})</h2>
          <div className="tablewrap" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Calon Peserta</th>
                  <th>Program</th>
                  <th>Tanggal Masuk</th>
                  <th>Status</th>
                  <th>Komisi</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const comm = l.commissions?.[0] || commissions.find((c) => c.leadId === l.id);
                  return (
                    <tr key={l.id}>
                      <td>
                        <b>{l.name}</b>
                        <br />
                        <span className="small muted">{maskPhone(l.phone)}</span>
                      </td>
                      <td>{l.program?.name || "Program Ahlan"}</td>
                      <td>{date(l.createdAt)}</td>
                      <td>
                        <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                      </td>
                      <td>
                        {comm ? (
                          <span
                            style={{
                              fontWeight: 700,
                              color: comm.status === "PAID" ? "#167043" : comm.status === "APPROVED" ? "#8b6828" : "#916316",
                            }}
                          >
                            {money(comm.amount)} ({labels[comm.status] || comm.status})
                          </span>
                        ) : (
                          <span className="muted">Menunggu Lunas</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
