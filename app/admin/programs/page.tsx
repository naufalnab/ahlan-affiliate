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
        <p className="eyebrow">Katalog Program</p>
        <h1>Program Kursus Ahlan ({programs.length})</h1>
        <p className="muted">Daftar kelas yang tersedia untuk pendaftaran peserta melalui affiliate.</p>
      </div>

      <div className="grid cards" style={{ marginTop: 16 }}>
        {programs.map((p) => (
          <article className="card" key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>{p.name}</h2>
              <span className="badge" style={{ background: p.active ? "#edf4ee" : "#f8e3e0", color: p.active ? "#167043" : "#a43f36" }}>
                {p.active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <p className="muted" style={{ margin: "10px 0 16px", minHeight: 40, fontSize: 13 }}>
              {p.description}
            </p>
            <p className="metric" style={{ fontSize: 20, color: "#0d5c4d" }}>
              {money(p.price)}
            </p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
