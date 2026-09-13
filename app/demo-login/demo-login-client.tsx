"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, UserCheck, BarChart3, Loader2 } from "lucide-react";
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
    // Set client cookie immediately
    document.cookie = `ahlan_demo_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    // Also call server action to ensure cookie header
    await setDemoRoleAction(role);

    // If nextPath matches the role's area, send them to nextPath, otherwise to default role route
    let target = `/${role}`;
    if (nextPath && nextPath.startsWith(`/${role}`)) {
      target = nextPath;
    }
    router.push(target);
    router.refresh();
  };

  return (
    <div className="grid" style={{ gap: 16, textAlign: "left", maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {requiredRole && nextPath && (
        <div className="notice" style={{ background: "#fff2d8", borderColor: "#f1deaf", color: "#8b6828", marginBottom: 8 }}>
          Halaman <code>{nextPath}</code> memerlukan akses peran <b>{requiredRole.toUpperCase()}</b>. Silakan pilih peran di bawah untuk melanjutkan.
        </div>
      )}

      {/* Admin Card */}
      <button
        type="button"
        className="card"
        onClick={() => handleSelectRole("admin")}
        disabled={loadingRole !== null}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          transition: "all 0.2s ease",
          borderColor: requiredRole === "admin" ? "#0d5c4d" : "#d5ddd7",
          borderWidth: requiredRole === "admin" ? 2 : 1,
          background: "#fff",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Admin Operasional</h2>
              {requiredRole === "admin" && <span className="demo" style={{ padding: "2px 8px", fontSize: 11 }}>Rekomendasi</span>}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Kelola calon peserta (Suyadi), update status lunas, verifikasi komisi, dan kelola mitra.
            </p>
          </div>
        </div>
        <div>
          {loadingRole === "admin" ? (
            <Loader2 className="animate-spin" size={18} color="#0d5c4d" />
          ) : (
            <ArrowRight size={18} color="#0d5c4d" />
          )}
        </div>
      </button>

      {/* Affiliate Card */}
      <button
        type="button"
        className="card"
        onClick={() => handleSelectRole("affiliate")}
        disabled={loadingRole !== null}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          transition: "all 0.2s ease",
          borderColor: requiredRole === "affiliate" ? "#0d5c4d" : "#d5ddd7",
          borderWidth: requiredRole === "affiliate" ? 2 : 1,
          background: "#fff",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Affiliate Naufal</h2>
              {requiredRole === "affiliate" && <span className="demo" style={{ padding: "2px 8px", fontSize: 11 }}>Rekomendasi</span>}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Pantau tautan unik NAUFAL, QR code, calon peserta yang masuk, dan saldo komisi.
            </p>
          </div>
        </div>
        <div>
          {loadingRole === "affiliate" ? (
            <Loader2 className="animate-spin" size={18} color="#0d5c4d" />
          ) : (
            <ArrowRight size={18} color="#0d5c4d" />
          )}
        </div>
      </button>

      {/* Management Card */}
      <button
        type="button"
        className="card"
        onClick={() => handleSelectRole("management")}
        disabled={loadingRole !== null}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          transition: "all 0.2s ease",
          borderColor: requiredRole === "management" ? "#0d5c4d" : "#d5ddd7",
          borderWidth: requiredRole === "management" ? 2 : 1,
          background: "#fff",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#edf4ee", padding: 12, borderRadius: 10, color: "#0d5c4d" }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: "0 0 4px" }}>Masuk sebagai Executive Management</h2>
              {requiredRole === "management" && <span className="demo" style={{ padding: "2px 8px", fontSize: 11 }}>Rekomendasi</span>}
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Tinjau performa akuisisi program, total revenue, rasio konversi, dan simulator proyeksi.
            </p>
          </div>
        </div>
        <div>
          {loadingRole === "management" ? (
            <Loader2 className="animate-spin" size={18} color="#0d5c4d" />
          ) : (
            <ArrowRight size={18} color="#0d5c4d" />
          )}
        </div>
      </button>
    </div>
  );
}
