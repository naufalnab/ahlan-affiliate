import { getRepository } from "@/lib/repository";
import { AdminShell } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const repo = await getRepository();
  const s = await repo.getAppSetting();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow" style={{ margin: "0 0 6px" }}>Konfigurasi Sistem</p>
        <h1 style={{ margin: "0 0 8px" }}>Aturan Komisi Affiliate</h1>
        <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
          Skema baku komisi saat peserta menyelesaikan pembayaran kursus.
        </p>
      </div>

      <section className="form" style={{ marginTop: 16 }}>
        <div className="field">
          <label style={{ fontSize: 13, color: "#193830" }}>Metode Komisi</label>
          <select defaultValue={s.commissionMethod} style={{ minHeight: 44 }}>
            <option value="FIXED">FIXED (Nominal Tetap per Peserta)</option>
            <option value="PERCENTAGE">PERCENTAGE (Persentase dari Nilai Kursus)</option>
          </select>
        </div>
        <div className="field">
          <label style={{ fontSize: 13, color: "#193830" }}>Jumlah Tetap (Rp)</label>
          <input type="number" defaultValue={s.fixedAmount} placeholder="75000" style={{ minHeight: 44 }} />
        </div>
        <div className="field">
          <label style={{ fontSize: 13, color: "#193830" }}>Persentase (%)</label>
          <input type="number" defaultValue={s.percentage} placeholder="10" style={{ minHeight: 44 }} />
        </div>
        <div className="field">
          <label style={{ fontSize: 13, color: "#193830" }}>Pemicu Pembuatan Komisi</label>
          <input
            type="text"
            defaultValue="Saat Pembayaran Diverifikasi (Status Lunas)"
            disabled
            style={{ background: "#f8f9f7", color: "#69766f", minHeight: 44 }}
          />
        </div>
        <button className="btn" type="button" style={{ marginTop: 8, width: "100%", minHeight: 44, justifyContent: "center" }}>
          Simpan Pengaturan
        </button>
      </section>
    </AdminShell>
  );
}
