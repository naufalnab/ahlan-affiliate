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

  // Accurate condition tracking
  const isSuyadiLunas = suyadiStatus === "LUNAS";
  const hasNewLead = leads.length > 12;

  const suyadiCommission = commissions.find((c) => c.leadId === suyadiId);
  const isCommissionApproved =
    suyadiCommission?.status === "APPROVED" || suyadiCommission?.status === "PAID";
  const isCommissionPaid = suyadiCommission?.status === "PAID";

  const referralUrl = `${appUrl()}/daftar?ref=NAUFAL`;

  return (
    <DemoGuidedExperience
      summary={{
        suyadiStatus,
        suyadiId,
        isSuyadiLunas,
        hasNewLead,
        isCommissionApproved,
        isCommissionPaid,
        referralUrl,
      }}
    />
  );
}
