"use client";

import { approveCommission, payCommission, updateCommissionStatus } from "@/server/actions";
import { useState } from "react";
import { Check, CheckCircle2, DollarSign } from "lucide-react";

export default function CommissionActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [busy, setBusy] = useState(false);

  if (status === "PAID") {
    return (
      <span
        className="badge PAID"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
        }}
      >
        <Check size={13} /> Sudah Dibayar
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="badge BATAL" style={{ padding: "5px 10px" }}>
        Dibatalkan
      </span>
    );
  }

  return (
    <div className="actions" style={{ alignItems: "center" }}>
      {status === "PENDING" && (
        <>
          <button
            type="button"
            className="btn"
            style={{ padding: "6px 12px", fontSize: 12, background: "#0d5c4d" }}
            onClick={async () => {
              setBusy(true);
              await approveCommission(id);
              setBusy(false);
            }}
            disabled={busy}
          >
            <CheckCircle2 size={13} />
            Setujui
          </button>
          <button
            type="button"
            className="btn alt"
            style={{ padding: "6px 10px", fontSize: 12, color: "#a43f36", borderColor: "#f0c4be" }}
            onClick={async () => {
              if (confirm("Batalkan komisi ini?")) {
                setBusy(true);
                await updateCommissionStatus(id, "CANCELLED");
                setBusy(false);
              }
            }}
            disabled={busy}
          >
            Batalkan
          </button>
        </>
      )}

      {status === "APPROVED" && (
        <button
          type="button"
          className="btn"
          style={{ padding: "6px 12px", fontSize: 12, background: "#c39542" }}
          onClick={async () => {
            setBusy(true);
            await payCommission(id);
            setBusy(false);
          }}
          disabled={busy}
        >
          <DollarSign size={13} />
          Tandai Dibayar
        </button>
      )}
    </div>
  );
}
