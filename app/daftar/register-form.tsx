"use client";

import { useState } from "react";
import { submitLead } from "@/server/actions";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterForm({
  programs,
  initialCode,
}: {
  programs: { id: string; name: string }[];
  initialCode?: string;
}) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (done) {
    return (
      <div className="form" style={{ textAlign: "center", padding: "32px 24px" }}>
        <CheckCircle2 size={48} color="#0d5c4d" style={{ margin: "0 auto 16px" }} />
        <h2>Jazakallahu khairan!</h2>
        <p className="lead" style={{ margin: "8px auto 20px" }}>
          Data pendaftaran berhasil diterima dan atribusi referral telah tercatat di sistem.
        </p>
        <div className="actions" style={{ justifyContent: "center" }}>
          <Link className="btn" href="/admin/leads">
            Lihat di Dashboard Admin <ArrowRight size={16} />
          </Link>
          <Link className="btn alt" href="/demo">
            Lanjut ke Alur Demo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const r = await submitLead(formData);
        setBusy(false);
        if (r.ok) {
          setDone(true);
        } else {
          setError(r.error || "Terjadi kesalahan saat memproses pendaftaran.");
        }
      }}
    >
      <div className="field">
        <label>Nama Lengkap</label>
        <input name="name" placeholder="Contoh: Fulan bin Fulan" required />
      </div>
      <div className="field">
        <label>Nomor WhatsApp</label>
        <input name="phone" placeholder="0812xxxxxxxx" required />
      </div>
      <div className="field">
        <label>Program yang Diminati</label>
        <select name="programId" required defaultValue={programs[0]?.id || ""}>
          <option value="" disabled>
            Pilih program
          </option>
          {programs.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Kota / Domisili</label>
        <input name="city" placeholder="Contoh: Bandung" required />
      </div>
      <div className="field">
        <label>Catatan Opsional</label>
        <textarea name="notes" placeholder="Catatan atau preferensi jadwal kelas..." />
      </div>
      <div className="field">
        <label>
          Kode Referral <span className="muted">(opsional)</span>
        </label>
        <input name="referralCode" defaultValue={initialCode} placeholder="Contoh: NAUFAL" />
      </div>
      {error && (
        <div className="notice" style={{ background: "#f8e3e0", borderColor: "#f0c4be", color: "#a43f36", marginBottom: 16 }}>
          {error}
        </div>
      )}
      <button className="btn" style={{ width: "100%" }} disabled={busy}>
        {busy ? "Mengirim Pendaftaran..." : "Kirim Pendaftaran"}
      </button>
    </form>
  );
}
