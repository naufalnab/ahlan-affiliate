"use client";

import { leadStatuses, type LeadStatus } from "@/lib/domain";
import { payCommission, updateLeadStatus, updateLeadValue } from "@/server/actions";
import { useState } from "react";
import { Check, CreditCard } from "lucide-react";

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
        setSuccessMsg(`Status diperbarui ke LUNAS & Komisi Rp${res.commissionAmount?.toLocaleString("id-ID")} dibuat.`);
      } else {
        setSuccessMsg(`Status diperbarui ke ${newStatus.replaceAll("_", " ")}.`);
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
              {s.replaceAll("_", " ")}
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
            background: commission.status === "PAID" ? "#edf4ee" : "#fff2d8",
            borderColor: commission.status === "PAID" ? "#cbe3d2" : "#f1deaf",
            color: commission.status === "PAID" ? "#167043" : "#8b6828",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <b>Komisi Rp{commission.amount.toLocaleString("id-ID")}</b>
              <br />
              <span style={{ fontSize: 12 }}>Status: <b>{commission.status === "PAID" ? "SUDAH DIBAYAR" : "PENDING"}</b></span>
            </div>
            {commission.status !== "PAID" && (
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
                Tandai Dibayar
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
          Komisi akan otomatis terbit begitu calon peserta diubah menjadi status <b>LUNAS</b>.
        </p>
      )}
    </section>
  );
}
