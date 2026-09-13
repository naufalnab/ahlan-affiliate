"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { ResetDemoModal } from "@/components/ui";

interface DemoStateSummary {
  suyadiStatus: string;
  suyadiId: string;
  isSuyadiLunas: boolean;
  hasNewLead: boolean;
  isCommissionApproved: boolean;
  isCommissionPaid: boolean;
  referralUrl: string;
}

export default function DemoGuidedExperience({
  summary,
}: {
  summary: DemoStateSummary;
}) {
  const [copied, setCopied] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<Record<number, boolean>>({});
  const [showResetModal, setShowResetModal] = useState(false);

  const markVisited = (step: number) => {
    setVisitedSteps((prev) => ({ ...prev, [step]: true }));
  };

  // Accurate condition tracking: No future step is marked complete before its real condition is met!
  const step1Complete = copied || !!visitedSteps[1];
  const step2Complete = !!visitedSteps[2];
  const step3Complete = summary.hasNewLead || !!visitedSteps[3];
  const step4Complete = !!visitedSteps[4];
  const step5Complete = summary.isSuyadiLunas; // ONLY complete when Suyadi actually reaches LUNAS
  const step6Complete = summary.isCommissionPaid; // ONLY complete when commission is actually PAID
  const step7Complete = summary.isCommissionPaid && !!visitedSteps[7];

  const completedCount = [
    step1Complete,
    step2Complete,
    step3Complete,
    step4Complete,
    step5Complete,
    step6Complete,
    step7Complete,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedCount / 7) * 100);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary.referralUrl);
    setCopied(true);
    markVisited(1);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="shell section" style={{ maxWidth: 860, margin: "0 auto", paddingBottom: 60 }}>
      <header className="nav" style={{ marginBottom: 20 }}>
        <Link href="/">
          <img className="logo" src="/brand/logo-ahlan.svg" alt="Ahlan" />
        </Link>
        <div className="actions">
          <button
            type="button"
            className="btn alt"
            style={{ fontSize: 12, padding: "7px 12px" }}
            onClick={() => setShowResetModal(true)}
          >
            <RotateCcw size={14} /> Reset Demo
          </button>
          <Link className="btn alt" href="/demo-login" style={{ fontSize: 12, padding: "7px 12px" }}>
            Ganti Peran
          </Link>
        </div>
      </header>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p className="eyebrow">Panduan Presentasi Interaktif</p>
        <h1 style={{ fontSize: 32, margin: "6px 0 10px" }}>Uji Alur End-to-End Ahlan Affiliate</h1>
        <p className="lead" style={{ margin: "0 auto", maxWidth: 640 }}>
          Simulasi alur lengkap: <b>Naufal (Affiliate)</b> → <b>Suyadi (Calon Peserta)</b> → <b>Pendaftaran</b> → <b>Pelunasan</b> → <b>Penerbitan & Pembayaran Komisi</b>.
        </p>
      </div>

      {/* Progress Demo Bar */}
      <section
        className="card"
        style={{
          background: "#fff",
          borderColor: "#dce4df",
          marginBottom: 24,
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, color: "#193830" }}>Progress Demo</span>
            <span className="demo" style={{ padding: "3px 8px", fontSize: 11 }}>
              {completedCount} dari 7 langkah selesai
            </span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0d5c4d" }}>{progressPercent}%</span>
        </div>
        <div className="bar" style={{ height: 8 }}>
          <i style={{ width: `${progressPercent}%`, transition: "width 0.4s ease" }} />
        </div>
      </section>

      {/* Guided Action Cards */}
      <div className="grid" style={{ gap: 14 }}>
        {/* Step 1 */}
        <article
          className="card"
          style={{
            borderColor: step1Complete ? "#b9ded1" : "#e3e5dd",
            background: step1Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 1</span>
                {step1Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Selesai
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Salin Link Referral Naufal</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Gunakan tautan unik dengan parameter <code>ref=NAUFAL</code> untuk mensimulasikan rekomendasi peserta.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <button
                type="button"
                className={copied ? "btn" : "btn alt"}
                onClick={handleCopy}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Link Berhasil Disalin" : "Salin Link"}
              </button>
            </div>
          </div>
        </article>

        {/* Step 2 */}
        <article
          className="card"
          style={{
            borderColor: step2Complete ? "#b9ded1" : "#e3e5dd",
            background: step2Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 2</span>
                {step2Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Selesai
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Buka Halaman Pendaftaran</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Pastikan banner <i>"Direkomendasikan oleh Naufal Nabila"</i> tampil secara otomatis pada form pendaftaran publik.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href="/daftar?ref=NAUFAL"
                target="_blank"
                rel="noopener noreferrer"
                className="btn alt"
                onClick={() => markVisited(2)}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Buka Pendaftaran <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* Step 3 */}
        <article
          className="card"
          style={{
            borderColor: step3Complete ? "#b9ded1" : "#e3e5dd",
            background: step3Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 3</span>
                {step3Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Terdaftar
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Daftarkan Calon Peserta Demo</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Kirim formulir pendaftaran baru untuk melihat atribusi sumber referral tercatat langsung di sistem.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href="/daftar?ref=NAUFAL"
                className="btn alt"
                onClick={() => markVisited(3)}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Buka Formulir <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* Step 4 */}
        <article
          className="card"
          style={{
            borderColor: step4Complete ? "#b9ded1" : "#e3e5dd",
            background: step4Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 4</span>
                {step4Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Terbuka
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Lihat Suyadi di Dashboard Admin</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Buka detail lead Suyadi untuk memeriksa informasi kontak, pilihan program, dan riwayat timeline aktivitas.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href={`/admin/leads/${summary.suyadiId}`}
                className="btn alt"
                onClick={() => markVisited(4)}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Buka Lead Suyadi <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* Step 5 */}
        <article
          className="card"
          style={{
            borderColor: step5Complete ? "#b9ded1" : "#e3e5dd",
            background: step5Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 5</span>
                <span className={`badge ${summary.suyadiStatus}`} style={{ fontSize: 11 }}>
                  Status Suyadi: {summary.suyadiStatus}
                </span>
                {step5Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Lunas
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Verifikasi Pembayaran Menjadi Lunas</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Ubah status menjadi <b>LUNAS</b> di panel kontrol lead. Ini otomatis memicu pencatatan hak komisi Rp75.000 untuk Naufal.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href={`/admin/leads/${summary.suyadiId}`}
                className="btn"
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                {summary.isSuyadiLunas ? "Lihat Status Lunas" : "Verifikasi Lunas"}
              </Link>
            </div>
          </div>
        </article>

        {/* Step 6 */}
        <article
          className="card"
          style={{
            borderColor: step6Complete ? "#b9ded1" : "#e3e5dd",
            background: step6Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 6</span>
                {step6Complete ? (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <Check size={14} /> Komisi Sudah Dibayar
                  </span>
                ) : summary.isCommissionApproved ? (
                  <span className="small" style={{ color: "#8b6828", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    Disetujui · Siap Ditransfer
                  </span>
                ) : null}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Setujui & Tandai Komisi Dibayar</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Buka Komisi Admin: Setujui komisi yang berstatus PENDING, lalu klik <b>Tandai Dibayar</b> saat dana telah ditransfer.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href="/admin/commissions"
                className="btn alt"
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Buka Komisi Admin <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* Step 7 */}
        <article
          className="card"
          style={{
            borderColor: step7Complete ? "#b9ded1" : "#e3e5dd",
            background: step7Complete ? "#fbfdfc" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="eyebrow" style={{ fontSize: 11 }}>LANGKAH 7</span>
                {step7Complete && (
                  <span className="small" style={{ color: "#167043", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                    <CheckCircle2 size={14} /> Alur Lengkap!
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 18, margin: "2px 0 6px" }}>Kembali ke Portal Affiliate Naufal</h2>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                Verifikasi bahwa total komisi sudah bertambah dan status peserta telah terupdate di dashboard portal mitra.
              </p>
            </div>
            <div style={{ flexShrink: 0, marginTop: 4 }}>
              <Link
                href="/affiliate"
                className="btn"
                onClick={() => markVisited(7)}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Buka Portal Naufal <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>
      </div>

      <ResetDemoModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
    </main>
  );
}
