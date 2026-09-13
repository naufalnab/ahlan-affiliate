import type { LeadStatus } from "./domain";

export interface Affiliate {
  id: string;
  name: string;
  code: string;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  clicks: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  commissionOverride?: number | null;
  active: boolean;
}

export interface LeadActivity {
  id: string;
  type: string;
  message: string;
  createdAt: Date | string;
  leadId: string;
}

export interface Commission {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED" | string;
  generatedAt: Date | string;
  approvedAt?: Date | string | null;
  paidAt?: Date | string | null;
  affiliateId: string;
  leadId: string;
  affiliate?: Affiliate;
  lead?: Lead;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  notes?: string | null;
  source: string;
  status: LeadStatus | string;
  registrationValue?: number | null;
  paymentVerifiedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  programId: string;
  affiliateId?: string | null;
  program?: Program;
  affiliate?: Affiliate | null;
  activities?: LeadActivity[];
  commissions?: Commission[];
}

export interface AppSetting {
  id: string;
  commissionMethod: "FIXED" | "PERCENTAGE";
  fixedAmount: number;
  percentage: number;
  triggerOnPayment: boolean;
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  city: string;
  programId: string;
  notes?: string | null;
  referralCode?: string | null;
}

export interface AffiliateRepository {
  getOverview(): Promise<{
    totalAffiliates: number;
    totalLeads: number;
    paidLeads: number;
    conversionRate: number;
    totalCommission: number;
    pendingCommission: number;
    approvedCommission: number;
    paidCommission: number;
    revenue: number;
    netRevenue: number;
    recentLeads: Lead[];
  }>;
  getAffiliates(): Promise<Array<Affiliate & { leads: Lead[] }>>;
  getAffiliateById(id: string): Promise<(Affiliate & { leads: Lead[]; commissions: Commission[] }) | null>;
  getAffiliateByCode(code: string): Promise<Affiliate | null>;
  getLeads(filters?: { search?: string; programId?: string; affiliateId?: string; status?: string }): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | null>;
  getCommissions(): Promise<Commission[]>;
  getPrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | null>;
  getAppSetting(): Promise<AppSetting>;
  getManagementMetrics(): Promise<{
    affiliatesCount: number;
    leadsCount: number;
    paidCount: number;
    conversionRate: number;
    revenue: number;
    affiliateCost: number;
    pendingCost: number;
    approvedCost: number;
    paidCost: number;
    netRevenue: number;
  }>;
  getAffiliatePortal(code: string): Promise<{
    affiliate: Affiliate;
    leads: Lead[];
    commissions: Commission[];
    totalCommission: number;
    pendingCommission: number;
    paidCommission: number;
    registeredCount: number;
    paidCount: number;
  } | null>;
  createLead(data: CreateLeadInput): Promise<{ ok: boolean; leadId?: string; error?: string }>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<{ ok: boolean; commissionCreated?: boolean; commissionAmount?: number }>;
  updateLeadValue(id: string, value: number): Promise<{ ok: boolean }>;
  approveCommission(id: string): Promise<{ ok: boolean; error?: string }>;
  payCommission(id: string): Promise<{ ok: boolean; error?: string }>;
  updateCommissionStatus(id: string, status: string): Promise<{ ok: boolean; error?: string }>;
  createAffiliate(data: { name: string; code: string; phone?: string | null }): Promise<{ ok: boolean; error?: string }>;
  resetDemo(): Promise<{ ok: boolean }>;
}
