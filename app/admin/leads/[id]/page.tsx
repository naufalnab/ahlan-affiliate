import { notFound } from "next/navigation";
import { getRepository } from "@/lib/repository";
import { date, money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";
import LeadControls from "./lead-controls";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = await getRepository();
  const lead = await repo.getLeadById(id);

  if (!lead) {
    notFound();
  }

  const comm = lead.commissions?.[0];

  return (
    <AdminShell>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/leads" className="btn alt" style={{ padding: "6px 12px", fontSize: 12 }}>
          <ArrowLeft size={14} /> Kembali ke Calon Peserta
        </Link>
      </div>

      <div className="pagehead" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="eyebrow">Detail calon peserta</p>
          <h1 style={{ margin: "4px 0" }}>{lead.name}</h1>
        </div>
        <span className={`badge ${lead.status}`} style={{ fontSize: 13, padding: "7px 12px" }}>
          {labels[lead.status] || lead.status}
        </span>
      </div>

      <div className="grid two">
        <div className="grid">
          <section className="card">
            <h2>Informasi pendaftaran</h2>
            <div className="statline">
              <span>Nomor WhatsApp</span>
              <a
                href={`https://wa.me/${lead.phone}`}
                className="btn alt"
                style={{ padding: "6px 12px", fontSize: 12 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi via WhatsApp ({lead.phone})
              </a>
            </div>
            <div className="statline">
              <span>Program Pilihan</span>
              <b>{lead.program?.name || "Program Ahlan"}</b>
            </div>
            <div className="statline">
              <span>Kota / Domisili</span>
              <b>{lead.city}</b>
            </div>
            <div className="statline">
              <span>Sumber Referral</span>
              <b>{lead.affiliate ? `${lead.affiliate.name} (${lead.affiliate.code})` : "Direct / Tanpa Affiliate"}</b>
            </div>
            <div className="statline">
              <span>Tanggal Masuk</span>
              <b>{date(lead.createdAt)}</b>
            </div>
            <div className="statline">
              <span>Nilai Pembayaran</span>
              <b>{money(lead.registrationValue || lead.program?.price || 500000)}</b>
            </div>
            <div style={{ marginTop: 14 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                <b>Catatan:</b> {lead.notes || "Tidak ada catatan."}
              </p>
            </div>
          </section>

          <section className="card">
            <h2>Riwayat aktivitas</h2>
            <div className="timeline" style={{ marginTop: 16 }}>
              {(lead.activities || []).map((a) => (
                <div className="event" key={a.id}>
                  <b>{date(a.createdAt)}</b>
                  <br />
                  <span className="muted">{a.message}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <LeadControls
          id={lead.id}
          status={lead.status}
          value={lead.registrationValue || lead.program?.price || 500000}
          commission={
            comm
              ? {
                  id: comm.id,
                  status: comm.status,
                  amount: comm.amount,
                }
              : undefined
          }
        />
      </div>
    </AdminShell>
  );
}
