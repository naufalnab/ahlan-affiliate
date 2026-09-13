import Link from "next/link";
import { getRepository } from "@/lib/repository";
import AhlanLogo from "@/components/brand/AhlanLogo";
import RegisterForm from "./register-form";

export const dynamic = "force-dynamic";

export default async function DaftarPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawRef = resolvedParams?.ref?.trim();

  let affiliate = null;
  let programs: any[] = [];
  try {
    const repo = await getRepository();
    if (rawRef) {
      affiliate = await repo.getAffiliateByCode(rawRef);
    }
    programs = await repo.getPrograms();
  } catch (e) {
    console.error("Daftar page query error:", e);
  }

  return (
    <main className="shell section center">
      <Link href="/" aria-label="Beranda Ahlan" style={{ display: "inline-flex", justifyContent: "center", marginBottom: 12 }}>
        <AhlanLogo size="lg" priority />
      </Link>
      <p className="eyebrow">Pendaftaran calon peserta</p>
      <h1>Mulai belajar Bahasa Arab bersama Ahlan</h1>
      {affiliate ? (
        <div className="notice" style={{ margin: "16px 0", textAlign: "left" }}>
          Direkomendasikan oleh <b>{affiliate.name}</b> (Kode: <code>{affiliate.code}</code>)
        </div>
      ) : rawRef ? (
        <div
          className="notice"
          style={{
            background: "#fbf1d9",
            borderColor: "#e4d6be",
            color: "#73561d",
            margin: "16px 0",
            textAlign: "left",
          }}
        >
          Kode referral <b>{rawRef}</b> tidak ditemukan. Anda tetap dapat melanjutkan pendaftaran program seperti biasa.
        </div>
      ) : null}
      <RegisterForm programs={programs} initialCode={affiliate?.code || ""} />
    </main>
  );
}
