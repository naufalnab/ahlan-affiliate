export type LeadStatus =
  | "LEAD_BARU"
  | "DIHUBUNGI"
  | "FOLLOW_UP"
  | "TERTARIK"
  | "DAFTAR"
  | "MENUNGGU_PEMBAYARAN"
  | "LUNAS"
  | "BATAL";

export const leadStatuses: LeadStatus[] = [
  "LEAD_BARU",
  "DIHUBUNGI",
  "FOLLOW_UP",
  "TERTARIK",
  "DAFTAR",
  "MENUNGGU_PEMBAYARAN",
  "LUNAS",
  "BATAL",
];

export const labels: Record<string, string> = {
  LEAD_BARU: "Lead Baru",
  DIHUBUNGI: "Sudah Dihubungi",
  FOLLOW_UP: "Follow Up",
  TERTARIK: "Tertarik",
  DAFTAR: "Sudah Daftar",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  LUNAS: "Lunas",
  BATAL: "Batal",
  PENDING: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  PAID: "Sudah Dibayar",
  CANCELLED: "Dibatalkan",
};

export function normalizePhone(phone: string): string {
  const digitsOnly = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digitsOnly.startsWith("0")) {
    return `62${digitsOnly.slice(1)}`;
  }
  return digitsOnly;
}

export function maskPhone(phone: string): string {
  const norm = normalizePhone(phone);
  if (norm.length <= 4) return norm;
  const prefix = norm.startsWith("62") ? "0" + norm.slice(2, 5) : norm.slice(0, 4);
  const suffix = norm.slice(-4);
  return `${prefix}••••${suffix}`;
}

export function calculateCommission(
  value: number,
  method: string,
  fixed: number,
  percentage: number
): number {
  return method === "FIXED" ? fixed : Math.round((value * percentage) / 100);
}

export function conversion(paid: number, leads: number): number {
  return leads > 0 ? Math.round((paid / leads) * 100) : 0;
}

export function simulation(
  price: number,
  affiliates: number,
  perAffiliate: number,
  rate: number,
  type: "FIXED" | "PERCENTAGE",
  commission: number
) {
  const leads = affiliates * perAffiliate;
  const students = Math.round((leads * rate) / 100);
  const gross = students * price;
  const cost =
    type === "FIXED" ? students * commission : Math.round((gross * commission) / 100);
  return {
    leads,
    students,
    gross,
    cost,
    net: gross - cost,
  };
}

// Centralized Domain Calculation Functions for Data Consistency
export interface LeadWithProgram {
  id: string;
  status: string;
  registrationValue?: number | null;
  program?: { price: number; name: string } | null;
  programId?: string;
}

export interface CommissionItem {
  id: string;
  amount: number;
  status: string;
}

export function calculateTotalReferralRevenue(
  leads: LeadWithProgram[],
  programsById?: Record<string, { price: number }>
): number {
  return leads
    .filter((l) => l.status === "LUNAS")
    .reduce((sum, l) => {
      if (l.registrationValue && l.registrationValue > 0) {
        return sum + l.registrationValue;
      }
      if (l.program?.price) {
        return sum + l.program.price;
      }
      if (programsById && l.programId && programsById[l.programId]) {
        return sum + programsById[l.programId].price;
      }
      return sum + 500000;
    }, 0);
}

export function calculateGeneratedCommission(commissions: CommissionItem[]): number {
  return commissions
    .filter((c) => c.status !== "CANCELLED")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function calculatePendingCommission(commissions: CommissionItem[]): number {
  return commissions
    .filter((c) => c.status === "PENDING")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function calculateApprovedCommission(commissions: CommissionItem[]): number {
  return commissions
    .filter((c) => c.status === "APPROVED")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function calculatePaidCommission(commissions: CommissionItem[]): number {
  return commissions
    .filter((c) => c.status === "PAID")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function calculateNetReferralRevenue(
  grossRevenue: number,
  commissionCost: number
): number {
  return grossRevenue - commissionCost;
}

export function calculateConversionRate(paidLeads: number, totalLeads: number): number {
  return conversion(paidLeads, totalLeads);
}
