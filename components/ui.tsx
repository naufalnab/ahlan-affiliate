"use client";

import {
  Check,
  Copy,
  ExternalLink,
  LayoutDashboard,
  RotateCcw,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resetDemoAction } from "@/server/actions";

export function CopyButton({ text, label = "Salin Link" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="btn alt"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      aria-label={label}
    >
      {ok ? <Check size={16} /> : <Copy size={16} />}
      {ok ? "Link Berhasil Disalin" : label}
    </button>
  );
}

export function ResetDemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(16, 62, 53, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: 440,
          width: "100%",
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p className="eyebrow" style={{ margin: 0 }}>Konfirmasi Presentasi</p>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: 0, cursor: "pointer", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Reset semua perubahan demo?</h2>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Semua perubahan status Suyadi, calon peserta baru yang baru saja didaftarkan, dan komisi demo akan dikembalikan ke kondisi awal presentasi Naufal.
        </p>
        <div className="actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn alt" onClick={onClose} disabled={busy}>
            Batal
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: "#a43f36" }}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await resetDemoAction();
              setBusy(false);
              onClose();
              window.location.reload();
            }}
          >
            <RotateCcw size={15} />
            {busy ? "Mereset..." : "Reset Demo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResetDemoButton({ compact = false }: { compact?: boolean }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn alt"
        style={{
          padding: compact ? "7px 12px" : "9px 14px",
          fontSize: 12,
          color: "#8b6828",
          borderColor: "#e4d6be",
          background: "#fffdf9",
        }}
        onClick={() => setShowModal(true)}
        title="Reset data demo ke awal"
      >
        <RotateCcw size={14} />
        Reset Demo
      </button>
      <ResetDemoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export function AdminNav() {
  return (
    <>
      <aside className="side">
        <Link href="/">
          <img className="logo" src="/brand/logo-ahlan.svg" alt="Ahlan Affiliate" />
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 16px" }}>
          <p className="demo" style={{ margin: 0 }}>PROTOTYPE / DEMO</p>
        </div>
        <nav>
          <Link href="/admin">Overview</Link>
          <Link href="/admin/leads">Calon Peserta</Link>
          <Link href="/admin/affiliates">Affiliate</Link>
          <Link href="/admin/commissions">Komisi</Link>
          <Link href="/admin/programs">Program</Link>
          <Link href="/management/simulator">Simulator</Link>
          <Link href="/admin/settings/commission">Pengaturan</Link>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <Link
            href="/demo"
            className="btn alt"
            style={{ width: "100%", boxSizing: "border-box", fontSize: 12, padding: "8px" }}
          >
            Panduan Demo
          </Link>
          <div style={{ marginTop: 8 }}>
            <ResetDemoButton compact />
          </div>
        </div>
      </aside>
      <nav className="mobile-nav">
        <Link href="/admin">
          <LayoutDashboard size={18} />
          Ringkasan
        </Link>
        <Link href="/admin/leads">
          <Users size={18} />
          Peserta
        </Link>
        <Link href="/admin/affiliates">
          <ExternalLink size={18} />
          Affiliate
        </Link>
        <Link href="/admin/commissions">
          <WalletCards size={18} />
          Komisi
        </Link>
      </nav>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="demo">Data simulasi untuk presentasi</span>
          </div>
          <div className="actions">
            <ResetDemoButton compact />
            <Link className="btn alt" href="/demo" style={{ fontSize: 12, padding: "7px 12px" }}>
              Panduan Demo
            </Link>
            <Link className="btn alt" href="/demo-login" style={{ fontSize: 12, padding: "7px 12px" }}>
              Ganti Peran
            </Link>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
