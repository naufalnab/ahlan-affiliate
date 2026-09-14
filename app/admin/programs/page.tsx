import { getRepository } from "@/lib/repository";
import { money } from "@/lib/format";
import { AdminShell } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Programs() {
  const repo = await getRepository();
  const programs = await repo.getPrograms();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Katalog Program</p>
        <h1 style={{ margin: "0 0 8px" }}>Program Kursus Ahlan ({programs.length})</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
          Daftar kelas yang tersedia untuk pendaftaran peserta melalui affiliate.
        </p>
      </div>

      <div className="grid cards" style={{ marginTop: 16 }}>
        {programs.map((p) => (
          <article className="card" key={p.id} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: 0, color: "#193830", wordBreak: "break-word" }}>{p.name}</h2>
              <span className="badge" style={{ background: p.active ? "#edf4ee" : "#f8e3e0", color: p.active ? "#167043" : "#a43f36", flexShrink: 0 }}>
                {p.active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <p className="muted" style={{ margin: "10px 0 16px", minHeight: 40, fontSize: 13, lineHeight: 1.5, flex: 1 }}>
              {p.description}
            </p>
            <div style={{ borderTop: "1px solid #edf0ec", paddingTop: 10 }}>
              <span style={{ fontSize: 11, color: "#69766f", display: "block" }}>Biaya Kursus:</span>
              <p className="metric" style={{ fontSize: 20, color: "#0d5c4d", margin: "2px 0 0" }}>
                {money(p.price)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
