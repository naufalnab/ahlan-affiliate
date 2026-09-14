"use client";

import { approveCommission, payCommission, updateCommissionStatus } from "@/server/actions";
import { useState } from "react";
import { Check, CheckCircle2, DollarSign, XCircle } from "lucide-react";

export default function CommissionActions({
  id,
  status,
  fullWidth = false,
}: {
  id: string;
  status: string;
  fullWidth?: boolean;
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
          padding: fullWidth ? "8px 14px" : "5px 10px",
          fontSize: fullWidth ? 13 : 11,
          justifyContent: fullWidth ? "center" : "flex-start",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        <Check size={14} /> Sudah Ditransfer
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span
        className="badge BATAL"
        style={{
          padding: fullWidth ? "8px 14px" : "5px 10px",
          fontSize: fullWidth ? 13 : 11,
          textAlign: "center",
          display: "inline-block",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        Dibatalkan
      </span>
    );
  }

  return (
    <div
      className="actions"
      style={{
        alignItems: "center",
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        gap: 8,
      }}
    >
      {status === "PENDING" && (
        <>
          <button
            type="button"
            className="btn"
            style={{
              padding: fullWidth ? "10px 14px" : "6px 12px",
              fontSize: fullWidth ? 13 : 12,
              background: "#0d5c4d",
              flex: fullWidth ? 1 : "initial",
              minHeight: fullWidth ? 44 : 34,
              justifyContent: "center",
            }}
            onClick={async () => {
              setBusy(true);
              await approveCommission(id);
              setBusy(false);
            }}
            disabled={busy}
          >
            <CheckCircle2 size={14} />
            <span>Setujui</span>
          </button>
          <button
            type="button"
            className="btn alt"
            style={{
              padding: fullWidth ? "10px 14px" : "6px 10px",
              fontSize: fullWidth ? 13 : 12,
              color: "#a43f36",
              borderColor: "#f0c4be",
              flex: fullWidth ? "initial" : "initial",
              minHeight: fullWidth ? 44 : 34,
              justifyContent: "center",
            }}
            onClick={async () => {
              if (confirm("Batalkan komisi ini?")) {
                setBusy(true);
                await updateCommissionStatus(id, "CANCELLED");
                setBusy(false);
              }
            }}
            disabled={busy}
          >
            <XCircle size={14} />
            <span>Batalkan</span>
          </button>
        </>
      )}

      {status === "APPROVED" && (
        <button
          type="button"
          className="btn"
          style={{
            padding: fullWidth ? "10px 14px" : "6px 12px",
            fontSize: fullWidth ? 13 : 12,
            background: "#c39542",
            width: fullWidth ? "100%" : "auto",
            minHeight: fullWidth ? 44 : 34,
            justifyContent: "center",
          }}
          onClick={async () => {
            setBusy(true);
            await payCommission(id);
            setBusy(false);
          }}
          disabled={busy}
        >
          <DollarSign size={14} />
          <span>Tandai Dibayar</span>
        </button>
      )}
    </div>
  );
}
