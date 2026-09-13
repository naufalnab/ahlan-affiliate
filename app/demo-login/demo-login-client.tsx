"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LayoutDashboard,
  UserCheck,
  BarChart3,
  Loader2,
  Sparkles,
} from "lucide-react";
import { setDemoRoleAction } from "@/server/actions";

interface DemoLoginClientProps {
  nextPath?: string;
  requiredRole?: string;
}

export default function DemoLoginClient({ nextPath, requiredRole }: DemoLoginClientProps) {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleSelectRole = async (role: "admin" | "affiliate" | "management") => {
    setLoadingRole(role);
    // Set client cookie immediately for instant client-side responsiveness
    document.cookie = `ahlan_demo_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    // Also trigger server action to ensure headers are set
    await setDemoRoleAction(role);

    // If nextPath matches the role's area, resume to nextPath; otherwise navigate to role root
    let target = `/${role}`;
    if (nextPath && nextPath.startsWith(`/${role}`)) {
      target = nextPath;
    }
    router.push(target);
    router.refresh();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textAlign: "left",
        maxWidth: 640,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {requiredRole && nextPath && (
        <div
          className="notice"
          style={{
            background: "#fff5df",
            borderColor: "#f0dfb2",
            color: "#805c19",
            marginBottom: 4,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Halaman <code>{nextPath}</code> memerlukan akses peran <b>{requiredRole.toUpperCase()}</b>. Silakan pilih peran di bawah untuk melanjutkan.
        </div>
      )}

      {/* CARD 1: Admin Ahlan (Recommended Starting Point) */}
      <button
        type="button"
        className="role-card-btn admin-recommended"
        onClick={() => handleSelectRole("admin")}
        disabled={loadingRole !== null}
        aria-label="Masuk sebagai Admin Ahlan - Disarankan mulai di sini"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1 }}>
          <div className="role-icon-box" style={{ marginTop: 2 }}>
            <LayoutDashboard size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px 8px",
                marginBottom: 4,
              }}
            >
              <span
                className="eyebrow"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#8b6828",
                  margin: 0,
                }}
              >
                OPERASIONAL
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  color: "#73561d",
                  background: "#fbf1d9",
                  border: "1px solid #ebdab2",
                  padding: "2px 7px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Sparkles size={11} color="#8b6828" />
                DISARANKAN MULAI DI SINI
              </span>
            </div>

            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#193830",
                margin: "0 0 5px",
                lineHeight: 1.3,
              }}
            >
              Masuk sebagai Admin Ahlan
            </h2>

            <p
              className="muted"
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: "#617169",
              }}
            >
              Kelola calon peserta, tindak lanjut pendaftaran, pembayaran, affiliate, dan komisi.
            </p>
          </div>
        </div>

        <div className="role-arrow-circle" aria-hidden="true">
          {loadingRole === "admin" ? (
            <Loader2 className="animate-spin" size={17} />
          ) : (
            <ArrowRight size={17} />
          )}
        </div>
      </button>

      {/* CARD 2: Affiliate (Mitra - Naufal Nabila) */}
      <button
        type="button"
        className="role-card-btn"
        onClick={() => handleSelectRole("affiliate")}
        disabled={loadingRole !== null}
        aria-label="Masuk sebagai Affiliate - Persona Demo Naufal Nabila"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1 }}>
          <div className="role-icon-box" style={{ marginTop: 2 }}>
            <UserCheck size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px 8px",
                marginBottom: 4,
              }}
            >
              <span
                className="eyebrow"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#8b6828",
                  margin: 0,
                }}
              >
                MITRA
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0d5c4d",
                  background: "#edf4ee",
                  border: "1px solid #d5e5db",
                  padding: "1px 7px",
                  borderRadius: 6,
                }}
              >
                Naufal Nabila
              </span>
            </div>

            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#193830",
                margin: "0 0 5px",
                lineHeight: 1.3,
              }}
            >
              Masuk sebagai Affiliate
            </h2>

            <p
              className="muted"
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: "#617169",
              }}
            >
              Pantau link referral, calon peserta yang masuk, status pendaftaran, dan komisi.
            </p>
          </div>
        </div>

        <div className="role-arrow-circle" aria-hidden="true">
          {loadingRole === "affiliate" ? (
            <Loader2 className="animate-spin" size={17} />
          ) : (
            <ArrowRight size={17} />
          )}
        </div>
      </button>

      {/* CARD 3: Manajemen Ahlan (Strategis) */}
      <button
        type="button"
        className="role-card-btn"
        onClick={() => handleSelectRole("management")}
        disabled={loadingRole !== null}
        aria-label="Masuk sebagai Manajemen Ahlan - Perspektif Strategis"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1 }}>
          <div className="role-icon-box" style={{ marginTop: 2 }}>
            <BarChart3 size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px 8px",
                marginBottom: 4,
              }}
            >
              <span
                className="eyebrow"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#8b6828",
                  margin: 0,
                }}
              >
                STRATEGIS
              </span>
            </div>

            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#193830",
                margin: "0 0 5px",
                lineHeight: 1.3,
              }}
            >
              Masuk sebagai Manajemen Ahlan
            </h2>

            <p
              className="muted"
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: "#617169",
              }}
            >
              Pantau peserta baru, tingkat konversi, pendapatan referral, biaya komisi, dan proyeksi pertumbuhan.
            </p>
          </div>
        </div>

        <div className="role-arrow-circle" aria-hidden="true">
          {loadingRole === "management" ? (
            <Loader2 className="animate-spin" size={17} />
          ) : (
            <ArrowRight size={17} />
          )}
        </div>
      </button>
    </div>
  );
}
