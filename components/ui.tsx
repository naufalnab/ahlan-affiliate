"use client";

import {
  BookOpen,
  Calculator,
  Check,
  Copy,
  Handshake,
  LayoutDashboard,
  MoreHorizontal,
  RotateCcw,
  Settings,
  UserCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { resetDemoAction } from "@/server/actions";
import AhlanLogo from "@/components/brand/AhlanLogo";

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
      style={{ minHeight: 44 }}
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
            style={{ background: "transparent", border: 0, cursor: "pointer", padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Tutup"
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
          minHeight: compact ? 36 : 44,
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
  const pathname = usePathname();

  const isTabActive = (route: string) => {
    if (route === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(route);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="side">
        <Link href="/" aria-label="Beranda Ahlan" style={{ display: "inline-block", marginBottom: 6 }}>
          <AhlanLogo size="md" onDark priority />
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 16px" }}>
          <p className="demo" style={{ margin: 0 }}>PROTOTYPE / DEMO</p>
        </div>
        <nav>
          <Link href="/admin" className={isTabActive("/admin") && pathname === "/admin" ? "active" : ""}>
            Overview
          </Link>
          <Link href="/admin/leads" className={isTabActive("/admin/leads") ? "active" : ""}>
            Calon Peserta
          </Link>
          <Link href="/admin/affiliates" className={isTabActive("/admin/affiliates") ? "active" : ""}>
            Affiliate
          </Link>
          <Link href="/admin/commissions" className={isTabActive("/admin/commissions") ? "active" : ""}>
            Komisi
          </Link>
          <Link href="/admin/programs" className={isTabActive("/admin/programs") ? "active" : ""}>
            Program
          </Link>
          <Link href="/management/simulator" className={pathname === "/management/simulator" ? "active" : ""}>
            Simulator
          </Link>
          <Link href="/admin/settings/commission" className={isTabActive("/admin/settings") ? "active" : ""}>
            Pengaturan
          </Link>
        </nav>
      </aside>

      {/* Mobile Fixed Bottom Navigation (4 Core Tabs) */}
      <nav className="mobile-nav" aria-label="Navigasi Utama Mobile">
        <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
          <LayoutDashboard size={19} />
          <span>Ringkasan</span>
        </Link>
        <Link href="/admin/leads" className={isTabActive("/admin/leads") ? "active" : ""}>
          <Users size={19} />
          <span>Peserta</span>
        </Link>
        <Link href="/admin/affiliates" className={isTabActive("/admin/affiliates") ? "active" : ""}>
          <Handshake size={19} />
          <span>Affiliate</span>
        </Link>
        <Link href="/admin/commissions" className={isTabActive("/admin/commissions") ? "active" : ""}>
          <WalletCards size={19} />
          <span>Komisi</span>
        </Link>
      </nav>
    </>
  );
}

export function MobileMenuDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showResetModal, setShowResetModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(16, 62, 53, 0.4)",
          backdropFilter: "blur(3px)",
          zIndex: 990,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#ffffff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: "20px 18px calc(24px + env(safe-area-inset-bottom))",
            boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
            maxHeight: "85vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p className="eyebrow" style={{ margin: 0, fontSize: 11 }}>Menu Ekstra Demo</p>
              <h3 style={{ margin: "2px 0 0", fontSize: 16, color: "#193830" }}>Navigasi & Tindakan</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f4f6f4",
                border: 0,
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#193830",
              }}
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              href="/demo"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8f9f7",
                color: "#193830",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <BookOpen size={18} color="#0d5c4d" />
              <span>Panduan Demo Interaktif</span>
            </Link>

            <Link
              href="/demo-login"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8f9f7",
                color: "#193830",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <UserCheck size={18} color="#0d5c4d" />
              <span>Ganti Peran / Sudut Pandang</span>
            </Link>

            <Link
              href="/admin/programs"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8f9f7",
                color: "#193830",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <LayoutDashboard size={18} color="#0d5c4d" />
              <span>Katalog Program Ahlan</span>
            </Link>

            <Link
              href="/management/simulator"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8f9f7",
                color: "#193830",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Calculator size={18} color="#0d5c4d" />
              <span>Simulator Ekonomi Affiliate</span>
            </Link>

            <Link
              href="/admin/settings/commission"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#f8f9f7",
                color: "#193830",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Settings size={18} color="#0d5c4d" />
              <span>Pengaturan Komisi</span>
            </Link>

            <div style={{ height: 1, background: "#edf0ec", margin: "8px 0" }} />

            <button
              type="button"
              onClick={() => {
                onClose();
                setShowResetModal(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#fcf2f1",
                border: "1px solid #f8d5d1",
                color: "#a43f36",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                minHeight: 44,
              }}
            >
              <RotateCcw size={18} color="#a43f36" />
              <span>Reset Data Demo ke Kondisi Awal</span>
            </button>
          </div>
        </div>
      </div>

      <ResetDemoModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="main">
        {/* Desktop Topbar (>= 1024px) */}
        <header className="topbar desktop-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="demo">Data simulasi untuk presentasi</span>
          </div>
          <div className="actions">
            <ResetDemoButton compact />
            <Link className="btn alt" href="/demo" style={{ fontSize: 12, padding: "7px 12px", minHeight: 36 }}>
              Panduan Demo
            </Link>
            <Link className="btn alt" href="/demo-login" style={{ fontSize: 12, padding: "7px 12px", minHeight: 36 }}>
              Ganti Peran
            </Link>
          </div>
        </header>

        {/* Mobile Topbar (< 1024px) */}
        <header className="mobile-topbar" aria-label="Mobile Header">
          <Link href="/" aria-label="Beranda Ahlan" style={{ display: "inline-flex", alignItems: "center" }}>
            <AhlanLogo size="sm" priority />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="demo" style={{ fontSize: 11, padding: "4px 8px", margin: 0 }}>
              DEMO
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 9,
                background: "#f4f6f4",
                border: "1px solid #dce3de",
                color: "#193830",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Buka Menu Tindakan"
              title="Menu Tindakan"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="content">{children}</div>

        <MobileMenuDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </main>
    </div>
  );
}
