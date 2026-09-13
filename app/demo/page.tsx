import { getRepository } from "@/lib/repository";
import { appUrl } from "@/lib/format";
import DemoGuidedExperience from "./demo-guided-client";

export const dynamic = "force-dynamic";

export default async function Demo() {
  const repo = await getRepository();
  const leads = await repo.getLeads();
  const commissions = await repo.getCommissions();

  const suyadi = leads.find((l) => l.name.toLowerCase().includes("suyadi")) || leads[0];
  const suyadiId = suyadi ? suyadi.id : "lead-suyadi";
  const suyadiStatus = suyadi ? String(suyadi.status) : "DIHUBUNGI";

  const hasLunasLead = leads.some((l) => l.status === "LUNAS" && l.id === suyadiId);
  const naufalCommissions = commissions.filter((c) => c.leadId === suyadiId || c.affiliate?.code === "NAUFAL");
  const hasCommission = naufalCommissions.length > 0;
  const hasPaidCommission = naufalCommissions.some((c) => c.status === "PAID");

  const referralUrl = `${appUrl()}/daftar?ref=NAUFAL`;

  return (
    <DemoGuidedExperience
      summary={{
        suyadiStatus,
        suyadiId,
        hasLunasLead,
        hasCommission,
        hasPaidCommission,
        referralUrl,
      }}
    />
  );
}
