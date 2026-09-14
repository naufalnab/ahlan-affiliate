import { notFound } from "next/navigation";
import { getRepository } from "@/lib/repository";
import { date, money } from "@/lib/format";
import { labels } from "@/lib/domain";
import { AdminShell } from "@/components/ui";
import LeadControls from "./lead-controls";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

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
        <Link href="/admin/leads" className="btn alt" style={{ padding: "6px 12px", fontSize: 12, minHeight: 36 }}>
          <ArrowLeft size={14} /> Kembali ke Calon Peserta
        </Link>
      </div>

      <div className="pagehead" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p className="eyebrow" style={{ margin: "0 0 4px" }}>Detail calon peserta</p>
          <h1 style={{ margin: "2px 0 0", wordBreak: "break-word" }}>{lead.name}</h1>
        </div>
        <span className={`badge ${lead.status}`} style={{ fontSize: 13, padding: "7px 12px" }}>
          {labels[lead.status] || lead.status}
        </span>
      </div>

      <div className="grid two" style={{ marginTop: 12 }}>
        <div className="grid" style={{ gap: 16 }}>
          <section className="card">
            <h2 style={{ fontSize: 18, margin: "0 0 14px" }}>Informasi pendaftaran</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBottom: 10, borderBottom: "1px solid #edf0ec" }}>
                <span className="muted">Nomor WhatsApp:</span>
                <a
                  href={`https://wa.me/${lead.phone}`}
                  className="btn alt"
                  style={{ padding: "6px 12px", fontSize: 12, minHeight: 36 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={14} color="#167043" />
                  <span>Hubungi ({lead.phone})</span>
                </a>
              </div>

              <div className="statline">
                <span className="muted">Program Pilihan:</span>
                <b style={{ textAlign: "right" }}>{lead.program?.name || "Program Ahlan"}</b>
              </div>

              <div className="statline">
                <span className="muted">Kota / Domisili:</span>
                <b>{lead.city}</b>
              </div>

              <div className="statline">
                <span className="muted">Sumber Referral:</span>
                <b style={{ textAlign: "right" }}>
                  {lead.affiliate ? `${lead.affiliate.name} (${lead.affiliate.code})` : "Direct / Tanpa Affiliate"}
                </b>
              </div>

              <div className="statline">
                <span className="muted">Tanggal Masuk:</span>
                <b>{date(lead.createdAt)}</b>
              </div>

              <div className="statline">
                <span className="muted">Nilai Pembayaran:</span>
                <b style={{ color: "#0d5c4d" }}>{money(lead.registrationValue || lead.program?.price || 500000)}</b>
              </div>
            </div>

            <div style={{ marginTop: 14, background: "#f8f9f7", padding: "10px 12px", borderRadius: 8 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                <b>Catatan:</b> {lead.notes || "Tidak ada catatan."}
              </p>
            </div>
          </section>

          <section className="card">
            <h2 style={{ fontSize: 18, margin: "0 0 14px" }}>Riwayat aktivitas</h2>
            <div className="timeline">
              {(lead.activities || []).map((a) => (
                <div className="event" key={a.id}>
                  <b>{date(a.createdAt)}</b>
                  <br />
                  <span className="muted" style={{ fontSize: 13 }}>{a.message}</span>
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
