import { getRepository } from "@/lib/repository";
import { AdminShell } from "@/components/ui";
import LeadsTableClient from "./leads-table-client";

export const dynamic = "force-dynamic";

export default async function Leads() {
  const repo = await getRepository();
  const leads = await repo.getLeads();
  const programs = await repo.getPrograms();
  const affiliates = await repo.getAffiliates();

  return (
    <AdminShell>
      <div className="pagehead">
        <p className="eyebrow">Calon peserta</p>
        <h1>Kelola Lead Referral ({leads.length})</h1>
        <p className="muted">Cari, filter berdasarkan program atau mitra affiliate, dan tindak lanjuti calon peserta.</p>
      </div>

      <LeadsTableClient leads={leads} programs={programs} affiliates={affiliates} />
    </AdminShell>
  );
}
