import { getRepository } from "@/lib/repository";
import { AdminShell } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const repo = await getRepository();
  const s = await repo.getAppSetting();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Konfigurasi Sistem</p>
        <h1>Aturan Komisi Affiliate</h1>
        <p className="muted">
          Skema baku komisi saat peserta menyelesaikan pembayaran kursus.
        </p>
      </div>

      <section className="form" style={{ marginTop: 16 }}>
        <div className="field">
          <label>Metode Komisi</label>
          <select defaultValue={s.commissionMethod}>
            <option value="FIXED">FIXED (Nominal Tetap per Peserta)</option>
            <option value="PERCENTAGE">PERCENTAGE (Persentase dari Nilai Kursus)</option>
          </select>
        </div>
        <div className="field">
          <label>Jumlah Tetap (Rp)</label>
          <input type="number" defaultValue={s.fixedAmount} placeholder="75000" />
        </div>
        <div className="field">
          <label>Persentase (%)</label>
          <input type="number" defaultValue={s.percentage} placeholder="10" />
        </div>
        <div className="field">
          <label>Pemicu Pembuatan Komisi</label>
          <input type="text" defaultValue="Saat Pembayaran Diverifikasi (Status Lunas)" disabled />
        </div>
        <button className="btn" type="button" style={{ marginTop: 8 }}>
          Simpan Pengaturan
        </button>
      </section>
    </AdminShell>
  );
}
