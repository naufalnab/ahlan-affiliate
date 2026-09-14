"use client";

import Link from "next/link";
import { useState } from "react";
import AhlanLogo from "@/components/brand/AhlanLogo";
import { money } from "@/lib/format";
import { simulation } from "@/lib/domain";

export default function Simulator() {
  const [v, setV] = useState({
    price: 500000,
    affiliates: 100,
    per: 3,
    rate: 30,
    type: "PERCENTAGE" as "FIXED" | "PERCENTAGE",
    commission: 10,
  });

  const r = simulation(v.price, v.affiliates, v.per, v.rate, v.type, v.commission);

  const field = (key: keyof typeof v, label: string) => (
    <div className="field">
      <label style={{ fontSize: 13, color: "#193830" }}>{label}</label>
      <input
        type="number"
        value={Number(v[key])}
        onChange={(e) => setV({ ...v, [key]: Number(e.target.value) })}
        style={{ minHeight: 44 }}
      />
    </div>
  );

  const metrics = [
    ["Potensi Lead", r.leads],
    ["Estimasi Peserta", r.students],
    ["Pendapatan Kotor", money(r.gross)],
    ["Biaya Komisi Affiliate", money(r.cost)],
    ["Pendapatan Setelah Komisi", money(r.net)],
  ];

  return (
    <main className="shell section center" style={{ paddingTop: 20 }}>
      <header className="nav" style={{ height: "auto", minHeight: 64, padding: "8px 0", flexWrap: "wrap", gap: 12 }}>
        <Link href="/" aria-label="Beranda Ahlan" style={{ display: "inline-flex", alignItems: "center" }}>
          <AhlanLogo size="md" priority />
        </Link>
        <Link className="btn alt" href="/management" style={{ fontSize: 13, padding: "8px 14px", minHeight: 38 }}>
          Kembali ke Manajemen
        </Link>
      </header>

      <div style={{ marginTop: 12 }}>
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Perencanaan Program</p>
        <h1 style={{ margin: "0 0 10px", wordBreak: "break-word" }}>Simulator Ekonomi Affiliate</h1>
        <p className="lead" style={{ margin: "0 0 20px" }}>
          Uji proyeksi pertumbuhan pendaftar, alokasi komisi, dan margin pendapatan sebelum merilis skema penawaran.
        </p>
      </div>

      <div className="grid sim-grid" style={{ marginTop: 16 }}>
        <section className="form">
          {field("price", "Harga Program (Rp)")}
          {field("affiliates", "Jumlah Mitra Affiliate")}
          {field("per", "Rata-rata Calon Peserta per Affiliate")}
          {field("rate", "Tingkat Konversi (%)")}

          <div className="field">
            <label style={{ fontSize: 13, color: "#193830" }}>Model Komisi</label>
            <select
              value={v.type}
              onChange={(e) =>
                setV({
                  ...v,
                  type: e.target.value as "FIXED" | "PERCENTAGE",
                  commission: e.target.value === "FIXED" ? 75000 : 10,
                })
              }
              style={{ minHeight: 44 }}
            >
              <option value="PERCENTAGE">Persentase (%)</option>
              <option value="FIXED">Nominal Tetap per Peserta (Rp)</option>
            </select>
          </div>

          {field(
            "commission",
            v.type === "FIXED" ? "Nominal Komisi per Peserta (Rp)" : "Persentase Komisi (%)"
          )}
        </section>

        <section className="grid" style={{ gap: 12 }}>
          {metrics.map(([label, val]) => (
            <article className="card" key={String(label)}>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                {label}
              </p>
              <p className="metric" style={{ margin: "6px 0 0", fontSize: "clamp(20px, 3vw, 24px)" }}>
                {val}
              </p>
            </article>
          ))}
          <p className="notice" style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            Simulasi ini merupakan kalkulasi estimasi matematis. Hasil realisasi aktual ditentukan oleh daya tarik program, kesesuaian target calon peserta, dan kualitas komunikasi tindak lanjut admin.
          </p>
        </section>
      </div>
    </main>
  );
}
