"use client";

import { leadStatuses, labels, type LeadStatus } from "@/lib/domain";
import { approveCommission, payCommission, updateLeadStatus, updateLeadValue } from "@/server/actions";
import { useState } from "react";
import { Check, CheckCircle2, CreditCard, DollarSign } from "lucide-react";

export default function LeadControls({
  id,
  status,
  value,
  commission,
}: {
  id: string;
  status: string;
  value: number;
  commission?: { id: string; status: string; amount: number };
}) {
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setBusy(true);
    setSuccessMsg("");
    const res = await updateLeadStatus(id, newStatus);
    setBusy(false);
    if (res?.ok) {
      if (res.commissionCreated) {
        setSuccessMsg(`Status diperbarui ke LUNAS & Komisi Rp${res.commissionAmount?.toLocaleString("id-ID")} diterbitkan.`);
      } else {
        setSuccessMsg(`Status diperbarui ke ${labels[newStatus] || newStatus}.`);
      }
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  return (
    <section className="card" style={{ height: "fit-content" }}>
      <h2>Tindakan Admin</h2>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        Perbarui tahapan follow-up atau validasi pelunasan untuk menerbitkan hak komisi affiliate.
      </p>

      {successMsg && (
        <div className="notice" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={16} />
          {successMsg}
        </div>
      )}

      <div className="field">
        <label>Status Calon Peserta</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          disabled={busy}
        >
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {labels[s] || s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Nilai Kelas (Rp)</label>
        <input
          type="number"
          defaultValue={value}
          onBlur={async (e) => {
            const val = Number(e.target.value);
            if (val > 0) {
              await updateLeadValue(id, val);
            }
          }}
          disabled={busy}
        />
      </div>

      <button
        type="button"
        className="btn"
        style={{ width: "100%", marginTop: 8 }}
        onClick={() => handleStatusChange("LUNAS")}
        disabled={busy || status === "LUNAS"}
      >
        <CreditCard size={16} />
        {status === "LUNAS" ? "Pembayaran Sudah Diverifikasi" : "Verifikasi Pembayaran & Buat Komisi"}
      </button>

      {commission ? (
        <div
          className="notice"
          style={{
            marginTop: 18,
            background:
              commission.status === "PAID"
                ? "#edf4ee"
                : commission.status === "APPROVED"
                ? "#fbf6e8"
                : "#fff2d8",
            borderColor:
              commission.status === "PAID"
                ? "#cbe3d2"
                : commission.status === "APPROVED"
                ? "#e8d8b2"
                : "#f1deaf",
            color:
              commission.status === "PAID"
                ? "#167043"
                : commission.status === "APPROVED"
                ? "#73561d"
                : "#8b6828",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <b>Komisi Rp{commission.amount.toLocaleString("id-ID")}</b>
              <br />
              <span style={{ fontSize: 12 }}>
                Status: <b>{labels[commission.status] || commission.status}</b>
              </span>
            </div>

            {commission.status === "PENDING" && (
              <button
                type="button"
                className="btn"
                style={{ padding: "7px 12px", fontSize: 12 }}
                onClick={async () => {
                  setBusy(true);
                  await approveCommission(commission.id);
                  setBusy(false);
                }}
                disabled={busy}
              >
                <CheckCircle2 size={13} />
                Setujui Komisi
              </button>
            )}

            {commission.status === "APPROVED" && (
              <button
                type="button"
                className="btn gold"
                style={{ padding: "7px 12px", fontSize: 12 }}
                onClick={async () => {
                  setBusy(true);
                  await payCommission(commission.id);
                  setBusy(false);
                }}
                disabled={busy}
              >
                <DollarSign size={13} />
                Tandai Dibayar
              </button>
            )}

            {commission.status === "PAID" && (
              <span className="badge PAID" style={{ padding: "5px 10px", fontSize: 11 }}>
                <Check size={12} /> Selesai
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
          Komisi akan otomatis terbit begitu calon peserta diubah menjadi status <b>Lunas</b>.
        </p>
      )}
    </section>
  );
}
