"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { date, money } from "@/lib/format";
import { labels, leadStatuses, type LeadStatus } from "@/lib/domain";
import { Search, RotateCcw, Filter, User } from "lucide-react";
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

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedProgram !== "ALL" ||
    selectedAffiliate !== "ALL" ||
    selectedStatus !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedProgram("ALL");
    setSelectedAffiliate("ALL");
    setSelectedStatus("ALL");
  };

  return (
    <div>
      {/* Filters Bar */}
      <div
        className="card"
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#8b9c94" }}
            />
            <input
              type="text"
              placeholder="Cari nama atau WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                border: "1px solid #ccd7d0",
                borderRadius: 8,
                fontSize: 13,
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
              style={{ fontSize: 12, padding: "5px 10px", color: "#a43f36", borderColor: "#f0c4be" }}
            >
              <RotateCcw size={12} /> Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="tablewrap desktop-table" style={{ display: "block" }}>
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

      {/* Responsive Mobile Cards */}
      <div className="mobile-cards" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        {filteredLeads.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 24 }}>
            <p className="muted" style={{ margin: 0 }}>Tidak ada data peserta.</p>
          </div>
        ) : (
          filteredLeads.map((l) => {
            const comm = l.commissions?.[0];
            return (
              <Link
                key={l.id}
                href={`/admin/leads/${l.id}`}
                className="card"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <b>{l.name}</b>
                  <span className={`badge ${l.status}`}>{labels[l.status] || l.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#53665e", marginBottom: 6 }}>
                  <span>{l.program?.name}</span> · <span>{l.city}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #edf0ec", paddingTop: 6 }}>
                  <span className="muted">Ref: {l.affiliate?.name || "Direct"}</span>
                  {comm ? (
                    <span style={{ fontWeight: 700, color: comm.status === "PAID" ? "#167043" : "#8b6828" }}>
                      {money(comm.amount)}
                    </span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-table {
            display: none !important;
          }
          .mobile-cards {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
