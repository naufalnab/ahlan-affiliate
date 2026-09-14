"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { date, money } from "@/lib/format";
import { labels, leadStatuses, maskPhone } from "@/lib/domain";
import { Search, RotateCcw, Filter, X, ChevronRight } from "lucide-react";
import type { Lead, Program, Affiliate } from "@/lib/types";

export default function LeadsTableClient({
  leads,
  programs,
  affiliates,
}: {
  leads: Lead[];
  programs: Program[];
  affiliates: Affiliate[];
}) {
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ALL");
  const [selectedAffiliate, setSelectedAffiliate] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Search filter
      if (search.trim()) {
        const s = search.toLowerCase().trim();
        const matchesName = l.name.toLowerCase().includes(s);
        const matchesPhone = l.phone.includes(s);
        if (!matchesName && !matchesPhone) return false;
      }

      // Program filter
      if (selectedProgram !== "ALL" && l.programId !== selectedProgram) {
        return false;
      }

      // Affiliate filter
      if (selectedAffiliate !== "ALL") {
        if (selectedAffiliate === "DIRECT" && l.affiliateId) return false;
        if (selectedAffiliate !== "DIRECT" && l.affiliateId !== selectedAffiliate) return false;
      }

      // Status filter
      if (selectedStatus !== "ALL" && l.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [leads, search, selectedProgram, selectedAffiliate, selectedStatus]);

  const activeFilterCount =
    (selectedProgram !== "ALL" ? 1 : 0) +
    (selectedAffiliate !== "ALL" ? 1 : 0) +
    (selectedStatus !== "ALL" ? 1 : 0);

  const hasActiveFilters = search.trim() !== "" || activeFilterCount > 0;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedProgram("ALL");
    setSelectedAffiliate("ALL");
    setSelectedStatus("ALL");
  };

  return (
    <div>
      {/* Desktop Filter Bar (>= 768px) */}
      <div
        className="card desktop-table-view"
        style={{
          padding: "16px 20px",
          marginBottom: 16,
          background: "#fff",
          border: "1px solid #dce4df",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Filter size={16} color="#0d5c4d" />
          <span style={{ fontWeight: 700, fontSize: 13, color: "#193830" }}>
            Pencarian & Filter Calon Peserta
          </span>
          <span className="demo" style={{ marginLeft: "auto", fontSize: 12, padding: "3px 8px" }}>
            {filteredLeads.length} dari {leads.length} calon peserta
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#8b9c94" }}
            />
            <input
              type="text"
              placeholder="Cari nama atau nomor WA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                border: "1px solid #ccd7d0",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
              }}
              aria-label="Cari nama atau nomor WhatsApp"
            />
          </div>

          {/* Program Filter */}
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccd7d0",
              borderRadius: 8,
              fontSize: 13,
              background: "#fff",
            }}
            aria-label="Filter Program"
          >
            <option value="ALL">Semua Program ({programs.length})</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Affiliate Filter */}
          <select
            value={selectedAffiliate}
            onChange={(e) => setSelectedAffiliate(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccd7d0",
              borderRadius: 8,
              fontSize: 13,
              background: "#fff",
            }}
            aria-label="Filter Mitra Affiliate"
          >
            <option value="ALL">Semua Sumber Referral</option>
            <option value="DIRECT">Tanpa Affiliate (Direct)</option>
            {affiliates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccd7d0",
              borderRadius: 8,
              fontSize: 13,
              background: "#fff",
            }}
            aria-label="Filter Status"
          >
            <option value="ALL">Semua Status</option>
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {labels[s] || s}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn alt"
              onClick={handleResetFilters}
              style={{ fontSize: 12, padding: "5px 10px", color: "#a43f36", borderColor: "#f0c4be", minHeight: 34 }}
            >
              <RotateCcw size={12} /> Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Header (< 768px) */}
      <div className="mobile-cards-view" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#8b9c94" }}
            />
            <input
              type="text"
              placeholder="Cari nama / WA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 32px",
                border: "1px solid #ccd7d0",
                borderRadius: 10,
                fontSize: 13,
                boxSizing: "border-box",
                minHeight: 44,
              }}
              aria-label="Cari nama atau nomor WhatsApp"
            />
          </div>

          <button
            type="button"
            className="btn alt"
            onClick={() => setMobileFilterOpen(true)}
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              fontSize: 13,
              minHeight: 44,
              borderColor: activeFilterCount > 0 ? "#0d5c4d" : "#d5ddd7",
              background: activeFilterCount > 0 ? "#edf4ee" : "#fff",
              color: activeFilterCount > 0 ? "#0d5c4d" : "#193830",
              fontWeight: 700,
            }}
          >
            <Filter size={15} />
            <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "#69766f" }}>
            Menampilkan <b>{filteredLeads.length}</b> dari {leads.length} calon peserta
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: "transparent",
                border: 0,
                color: "#a43f36",
                fontSize: 12,
                cursor: "pointer",
                padding: "4px 6px",
                fontWeight: 600,
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(16, 62, 53, 0.45)",
            backdropFilter: "blur(3px)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: "20px 18px calc(24px + env(safe-area-inset-bottom))",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p className="eyebrow" style={{ margin: 0, fontSize: 11 }}>Filter Calon Peserta</p>
                <h3 style={{ margin: "2px 0 0", fontSize: 16 }}>Pilih Kriteria</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
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
                }}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: 12, color: "#69766f" }}>Program Pilihan</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  style={{ minHeight: 44 }}
                >
                  <option value="ALL">Semua Program ({programs.length})</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: 12, color: "#69766f" }}>Sumber Referral / Mitra</label>
                <select
                  value={selectedAffiliate}
                  onChange={(e) => setSelectedAffiliate(e.target.value)}
                  style={{ minHeight: 44 }}
                >
                  <option value="ALL">Semua Sumber Referral</option>
                  <option value="DIRECT">Tanpa Affiliate (Direct)</option>
                  {affiliates.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: 12, color: "#69766f" }}>Status Pendaftaran</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ minHeight: 44 }}
                >
                  <option value="ALL">Semua Status</option>
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {labels[s] || s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn alt"
                  onClick={handleResetFilters}
                  style={{ flex: 1, minHeight: 44 }}
                >
                  Reset Filter
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setMobileFilterOpen(false)}
                  style={{ flex: 1, minHeight: 44 }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View (>= 768px) */}
      <div className="tablewrap desktop-table-view">
        <table>
          <thead>
            <tr>
              <th>Nama Calon Peserta</th>
              <th>Program</th>
              <th>Affiliate</th>
              <th>Tanggal Masuk</th>
              <th>Status</th>
              <th>Hak Komisi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "32px 16px" }} className="muted">
                  Tidak ada calon peserta yang cocok dengan filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredLeads.map((l) => {
                const comm = l.commissions?.[0];
                return (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/admin/leads/${l.id}`} style={{ textDecoration: "none" }}>
                        <b style={{ color: "#193830" }}>{l.name}</b>
                        <br />
                        <span className="small muted">{l.phone}</span>
                      </Link>
                    </td>
                    <td>{l.program?.name || "—"}</td>
                    <td>
                      {l.affiliate ? (
                        <span>
                          {l.affiliate.name}
                          <br />
                          <code className="small">{l.affiliate.code}</code>
                        </span>
                      ) : (
                        <span className="muted">— (Direct)</span>
                      )}
                    </td>
                    <td>{date(l.createdAt)}</td>
                    <td>
                      <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                    </td>
                    <td>
                      {comm ? (
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              comm.status === "PAID"
                                ? "#167043"
                                : comm.status === "APPROVED"
                                ? "#8b6828"
                                : "#916316",
                          }}
                        >
                          {money(comm.amount)} ({labels[comm.status] || comm.status})
                        </span>
                      ) : (
                        <span className="muted">Menunggu Lunas</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (< 768px) */}
      <div className="mobile-cards-view">
        {filteredLeads.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 24 }}>
            <p className="muted" style={{ margin: 0 }}>Tidak ada data calon peserta yang cocok.</p>
          </div>
        ) : (
          filteredLeads.map((l) => {
            const comm = l.commissions?.[0];
            return (
              <div
                key={l.id}
                className="card"
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Header: Name + Status Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <b style={{ fontSize: 16, color: "#193830", display: "block", wordBreak: "break-word" }}>
                      {l.name}
                    </b>
                    <span style={{ fontSize: 13, color: "#69766f", display: "block", marginTop: 2 }}>
                      {maskPhone(l.phone)}
                    </span>
                  </div>
                  <span className={`badge ${l.status}`} style={{ flexShrink: 0 }}>
                    {labels[l.status] || l.status}
                  </span>
                </div>

                {/* Body details */}
                <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 4, color: "#374c43" }}>
                  <div>
                    <span className="muted">Program:</span> <b>{l.program?.name || "Program Ahlan"}</b>
                  </div>
                  <div>
                    <span className="muted">Affiliate:</span>{" "}
                    <b>{l.affiliate ? `${l.affiliate.name} (${l.affiliate.code})` : "Direct / Tanpa Affiliate"}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#69766f", marginTop: 2 }}>
                    <span>Masuk: {date(l.createdAt)}</span>
                    {comm && (
                      <span style={{ fontWeight: 700, color: comm.status === "PAID" ? "#167043" : "#8b6828" }}>
                        Komisi: {money(comm.amount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Detail action button */}
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="btn alt"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: 13,
                    minHeight: 44,
                    padding: "9px 12px",
                    marginTop: 4,
                  }}
                >
                  <span>Detail Calon Peserta</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
