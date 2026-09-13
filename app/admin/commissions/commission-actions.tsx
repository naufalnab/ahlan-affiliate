"use client";

import { updateCommissionStatus } from "@/server/actions";
import { useState } from "react";
import { Check } from "lucide-react";

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
      <span className="small muted" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#167043" }}>
        <Check size={14} /> Selesai
      </span>
    );
  }

  if (status === "CANCELLED") {
    return <span className="small muted">Dibatalkan</span>;
  }

  return (
    <div className="actions">
      {status === "PENDING" && (
        <button
          type="button"
          className="btn alt"
          style={{ padding: "6px 10px", fontSize: 12 }}
          onClick={async () => {
            setBusy(true);
            await updateCommissionStatus(id, "APPROVED");
            setBusy(false);
          }}
          disabled={busy}
        >
          Setujui
        </button>
      )}
      <button
        type="button"
        className="btn"
        style={{ padding: "6px 10px", fontSize: 12 }}
        onClick={async () => {
          setBusy(true);
          await updateCommissionStatus(id, "PAID");
          setBusy(false);
        }}
        disabled={busy}
      >
        Tandai Dibayar
      </button>
    </div>
  );
}
