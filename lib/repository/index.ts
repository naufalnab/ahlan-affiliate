import type {
  Affiliate,
  Program,
  Lead,
  Commission,
  AppSetting,
  AffiliateRepository,
  CreateLeadInput,
} from "../types";
import {
  initialPrograms,
  initialAffiliates,
  initialLeads,
  initialCommissions,
  initialSetting,
} from "../seed-data";
import {
  calculateCommission,
  normalizePhone,
  calculateTotalReferralRevenue,
  calculateGeneratedCommission,
  calculatePendingCommission,
  calculateApprovedCommission,
  calculatePaidCommission,
  calculateNetReferralRevenue,
  calculateConversionRate,
  type LeadStatus,
} from "../domain";

export interface DemoSessionDelta {
  modifiedLeads: Record<string, Partial<Lead>>;
  newLeads: Lead[];
  modifiedCommissions: Record<string, Partial<Commission>>;
  newCommissions: Commission[];
  newAffiliates: Affiliate[];
  extraActivities: Record<string, Array<{ id: string; type: string; message: string; createdAt: string; leadId: string }>>;
  clicks: Record<string, number>;
}

const emptyDelta: DemoSessionDelta = {
  modifiedLeads: {},
  newLeads: [],
  modifiedCommissions: {},
  newCommissions: [],
  newAffiliates: [],
  extraActivities: {},
  clicks: {},
};

let inMemoryDelta: DemoSessionDelta = JSON.parse(JSON.stringify(emptyDelta));

export async function getDemoCookieDelta(): Promise<DemoSessionDelta> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const val = cookieStore.get("ahlan_demo_state")?.value;
    if (!val) return inMemoryDelta;
    return JSON.parse(decodeURIComponent(val));
  } catch {
    return inMemoryDelta;
  }
}

export async function saveDemoCookieDelta(delta: DemoSessionDelta | null): Promise<void> {
  if (delta === null) {
    inMemoryDelta = JSON.parse(JSON.stringify(emptyDelta));
  } else {
    inMemoryDelta = delta;
  }
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    if (delta === null) {
      cookieStore.delete("ahlan_demo_state");
    } else {
      cookieStore.set("ahlan_demo_state", encodeURIComponent(JSON.stringify(delta)), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        httpOnly: false,
      });
    }
  } catch {
    // Outside request context, inMemoryDelta handles it
  }
}

export class DemoRepository implements AffiliateRepository {
  private async loadState() {
    const delta = await getDemoCookieDelta();
    const programs: Program[] = JSON.parse(JSON.stringify(initialPrograms));
    let affiliates: Affiliate[] = JSON.parse(JSON.stringify(initialAffiliates));
    let leads: Lead[] = JSON.parse(JSON.stringify(initialLeads));
    let commissions: Commission[] = JSON.parse(JSON.stringify(initialCommissions));
    const setting: AppSetting = JSON.parse(JSON.stringify(initialSetting));

    // 1. Merge new affiliates
    if (delta.newAffiliates?.length) {
      affiliates = [...delta.newAffiliates, ...affiliates];
    }
    // 2. Merge click counters
    for (const aff of affiliates) {
      if (delta.clicks?.[aff.id]) {
        aff.clicks += delta.clicks[aff.id];
      }
    }
    // 3. Merge modified leads
    for (const lead of leads) {
      if (delta.modifiedLeads?.[lead.id]) {
        Object.assign(lead, delta.modifiedLeads[lead.id]);
      }
    }
    // 4. Merge new leads
    if (delta.newLeads?.length) {
      leads = [...delta.newLeads, ...leads];
    }
    // 5. Merge extra activities into leads
    for (const lead of leads) {
      const extras = delta.extraActivities?.[lead.id] || [];
      if (extras.length) {
        lead.activities = [...extras, ...(lead.activities || [])];
      }
    }
    // 6. Merge modified commissions
    for (const comm of commissions) {
      if (delta.modifiedCommissions?.[comm.id]) {
        Object.assign(comm, delta.modifiedCommissions[comm.id]);
      }
    }
    // 7. Merge new commissions
    if (delta.newCommissions?.length) {
      commissions = [...delta.newCommissions, ...commissions];
    }

    // Attach relations
    for (const lead of leads) {
      lead.program = programs.find((p) => p.id === lead.programId) || programs[0];
      lead.affiliate = lead.affiliateId ? affiliates.find((a) => a.id === lead.affiliateId) || null : null;
      lead.commissions = commissions.filter((c) => c.leadId === lead.id);
    }
    for (const comm of commissions) {
      comm.lead = leads.find((l) => l.id === comm.leadId);
      comm.affiliate = affiliates.find((a) => a.id === comm.affiliateId);
    }

    return { programs, affiliates, leads, commissions, setting };
  }

  async getOverview() {
    const { affiliates, leads, commissions, programs } = await this.loadState();
    const paidLeads = leads.filter((l) => l.status === "LUNAS").length;
    const totalLeads = leads.length;
    const conversionRate = calculateConversionRate(paidLeads, totalLeads);

    const programsById = Object.fromEntries(programs.map((p) => [p.id, p]));
    const revenue = calculateTotalReferralRevenue(leads, programsById);
    const totalCommission = calculateGeneratedCommission(commissions);
    const pendingCommission = calculatePendingCommission(commissions);
    const approvedCommission = calculateApprovedCommission(commissions);
    const paidCommission = calculatePaidCommission(commissions);
    const netRevenue = calculateNetReferralRevenue(revenue, totalCommission);

    return {
      totalAffiliates: affiliates.length,
      totalLeads,
      paidLeads,
      conversionRate,
      totalCommission,
      pendingCommission,
      approvedCommission,
      paidCommission,
      revenue,
      netRevenue,
      recentLeads: leads.slice(0, 6),
    };
  }

  async getAffiliates() {
    const { affiliates, leads } = await this.loadState();
    return affiliates.map((a) => ({
      ...a,
      leads: leads.filter((l) => l.affiliateId === a.id),
    }));
  }

  async getAffiliateById(id: string) {
    const { affiliates, leads, commissions } = await this.loadState();
    const aff = affiliates.find((a) => a.id === id);
    if (!aff) return null;
    return {
      ...aff,
      leads: leads.filter((l) => l.affiliateId === id),
      commissions: commissions.filter((c) => c.affiliateId === id),
    };
  }

  async getAffiliateByCode(code: string) {
    if (!code) return null;
    const { affiliates } = await this.loadState();
    const clean = code.trim().toUpperCase();
    return affiliates.find((a) => a.code.toUpperCase() === clean && a.isActive) || null;
  }

  async getLeads(filters?: { search?: string; programId?: string; affiliateId?: string; status?: string }) {
    const { leads } = await this.loadState();
    let result = leads;
    if (filters?.programId && filters.programId !== "Semua program") {
      result = result.filter((l) => l.programId === filters.programId || l.program?.name === filters.programId);
    }
    if (filters?.affiliateId && filters.affiliateId !== "Semua affiliate") {
      result = result.filter((l) => l.affiliateId === filters.affiliateId || l.affiliate?.name === filters.affiliateId);
    }
    if (filters?.status && filters.status !== "Semua status") {
      result = result.filter((l) => l.status === filters.status || l.status.replaceAll("_", " ") === filters.status);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase().trim();
      result = result.filter((l) => l.name.toLowerCase().includes(s) || l.phone.includes(s));
    }
    return result;
  }

  async getLeadById(id: string) {
    const { leads } = await this.loadState();
    return leads.find((l) => l.id === id) || null;
  }

  async getCommissions() {
    const { commissions } = await this.loadState();
    return commissions;
  }

  async getPrograms() {
    const { programs } = await this.loadState();
    return programs;
  }

  async getProgramById(id: string) {
    const { programs } = await this.loadState();
    return programs.find((p) => p.id === id) || null;
  }

  async getAppSetting() {
    const { setting } = await this.loadState();
    return setting;
  }

  async getManagementMetrics() {
    const { affiliates, leads, commissions, programs } = await this.loadState();
    const paidList = leads.filter((l) => l.status === "LUNAS");
    const conversionRate = calculateConversionRate(paidList.length, leads.length);

    const programsById = Object.fromEntries(programs.map((p) => [p.id, p]));
    const revenue = calculateTotalReferralRevenue(leads, programsById);
    const affiliateCost = calculateGeneratedCommission(commissions);
    const pendingCost = calculatePendingCommission(commissions);
    const approvedCost = calculateApprovedCommission(commissions);
    const paidCost = calculatePaidCommission(commissions);
    const netRevenue = calculateNetReferralRevenue(revenue, affiliateCost);

    return {
      affiliatesCount: affiliates.length,
      leadsCount: leads.length,
      paidCount: paidList.length,
      conversionRate,
      revenue,
      affiliateCost,
      pendingCost,
      approvedCost,
      paidCost,
      netRevenue,
    };
  }

  async getAffiliatePortal(code: string) {
    const aff = await this.getAffiliateByCode(code);
    if (!aff) return null;
    const { leads, commissions } = await this.loadState();
    const affLeads = leads.filter((l) => l.affiliateId === aff.id);
    const affCommissions = commissions.filter((c) => c.affiliateId === aff.id);
    const registeredCount = affLeads.filter((l) =>
      ["DAFTAR", "MENUNGGU_PEMBAYARAN", "LUNAS"].includes(l.status)
    ).length;
    const paidCount = affLeads.filter((l) => l.status === "LUNAS").length;

    const totalCommission = calculateGeneratedCommission(affCommissions);
    const pendingCommission = calculatePendingCommission(affCommissions);
    const paidCommission = calculatePaidCommission(affCommissions);

    return {
      affiliate: aff,
      leads: affLeads,
      commissions: affCommissions,
      totalCommission,
      pendingCommission,
      paidCommission,
      registeredCount,
      paidCount,
    };
  }

  async createLead(input: CreateLeadInput) {
    const delta = await getDemoCookieDelta();
    let affiliate = null;
    if (input.referralCode) {
      affiliate = await this.getAffiliateByCode(input.referralCode);
    }
    const id = `lead-${Date.now()}`;
    const now = new Date().toISOString();
    const normalized = normalizePhone(input.phone);

    const newLead: Lead = {
      id,
      name: input.name,
      phone: normalized,
      city: input.city,
      notes: input.notes || null,
      source: affiliate ? "REFERRAL_LINK" : "DIRECT",
      status: "LEAD_BARU",
      createdAt: now,
      updatedAt: now,
      programId: input.programId,
      affiliateId: affiliate ? affiliate.id : null,
      activities: [
        {
          id: `act-${Date.now()}`,
          leadId: id,
          type: "CREATED",
          message: affiliate
            ? `Referral masuk melalui kode ${affiliate.code}`
            : "Pendaftaran baru diterima",
          createdAt: now,
        },
      ],
    };

    delta.newLeads = [newLead, ...(delta.newLeads || [])];
    if (affiliate) {
      delta.clicks = delta.clicks || {};
      delta.clicks[affiliate.id] = (delta.clicks[affiliate.id] || 0) + 1;
    }
    await saveDemoCookieDelta(delta);
    return { ok: true, leadId: id };
  }

  async updateLeadStatus(id: string, status: LeadStatus) {
    const delta = await getDemoCookieDelta();
    const lead = await this.getLeadById(id);
    if (!lead) return { ok: false };

    delta.modifiedLeads = delta.modifiedLeads || {};
    const existingMod = delta.modifiedLeads[id] || {};
    const now = new Date().toISOString();

    const patch: Partial<Lead> = {
      ...existingMod,
      status,
      updatedAt: now,
    };
    if (status === "LUNAS") {
      patch.paymentVerifiedAt = now;
    }
    delta.modifiedLeads[id] = patch;

    // Add activity
    delta.extraActivities = delta.extraActivities || {};
    delta.extraActivities[id] = delta.extraActivities[id] || [];
    delta.extraActivities[id].unshift({
      id: `act-status-${Date.now()}`,
      leadId: id,
      type: "STATUS",
      message:
        status === "LUNAS"
          ? "Status diperbarui menjadi Lunas (Pembayaran Diverifikasi)"
          : `Admin mengubah status menjadi ${status.replaceAll("_", " ")}`,
      createdAt: now,
    });

    let commissionCreated = false;
    let commissionAmount = 0;

    // Duplicate commission check: only create if status is LUNAS, lead has an affiliate, and no commission exists yet
    const { commissions, setting } = await this.loadState();
    const hasCommission = commissions.some((c) => c.leadId === id);

    if (status === "LUNAS" && lead.affiliateId && !hasCommission) {
      commissionAmount = calculateCommission(
        lead.registrationValue || lead.program?.price || 500000,
        setting.commissionMethod,
        setting.fixedAmount,
        setting.percentage
      );

      const commId = `comm-${Date.now()}`;
      const newComm: Commission = {
        id: commId,
        leadId: id,
        affiliateId: lead.affiliateId,
        amount: commissionAmount,
        status: "PENDING",
        generatedAt: now,
      };

      delta.newCommissions = [newComm, ...(delta.newCommissions || [])];
      delta.extraActivities[id].unshift({
        id: `act-comm-${Date.now()}`,
        leadId: id,
        type: "COMMISSION",
        message: `Komisi Rp${commissionAmount.toLocaleString("id-ID")} diterbitkan untuk ${lead.affiliate?.name || "Affiliate"} (Menunggu Persetujuan)`,
        createdAt: now,
      });
      commissionCreated = true;
    }

    await saveDemoCookieDelta(delta);
    return { ok: true, commissionCreated, commissionAmount };
  }

  async updateLeadValue(id: string, value: number) {
    const delta = await getDemoCookieDelta();
    delta.modifiedLeads = delta.modifiedLeads || {};
    delta.modifiedLeads[id] = {
      ...(delta.modifiedLeads[id] || {}),
      registrationValue: value,
    };

    delta.extraActivities = delta.extraActivities || {};
    delta.extraActivities[id] = delta.extraActivities[id] || [];
    delta.extraActivities[id].unshift({
      id: `act-val-${Date.now()}`,
      leadId: id,
      type: "PAYMENT",
      message: `Nilai kelas diperbarui menjadi Rp${value.toLocaleString("id-ID")}`,
      createdAt: new Date().toISOString(),
    });

    await saveDemoCookieDelta(delta);
    return { ok: true };
  }

  async approveCommission(id: string) {
    const { commissions } = await this.loadState();
    const comm = commissions.find((c) => c.id === id);
    if (!comm) return { ok: false, error: "Komisi tidak ditemukan." };
    if (comm.status !== "PENDING") {
      return { ok: false, error: "Hanya komisi dengan status Menunggu Persetujuan yang dapat disetujui." };
    }

    const delta = await getDemoCookieDelta();
    delta.modifiedCommissions = delta.modifiedCommissions || {};
    const now = new Date().toISOString();
    delta.modifiedCommissions[id] = {
      ...(delta.modifiedCommissions[id] || {}),
      status: "APPROVED",
      approvedAt: now,
    };

    if (comm.leadId) {
      delta.extraActivities = delta.extraActivities || {};
      delta.extraActivities[comm.leadId] = delta.extraActivities[comm.leadId] || [];
      delta.extraActivities[comm.leadId].unshift({
        id: `act-comm-appr-${Date.now()}`,
        leadId: comm.leadId,
        type: "COMMISSION",
        message: `Komisi Rp${comm.amount.toLocaleString("id-ID")} disetujui oleh admin`,
        createdAt: now,
      });
    }

    await saveDemoCookieDelta(delta);
    return { ok: true };
  }

  async payCommission(id: string) {
    const { commissions } = await this.loadState();
    const comm = commissions.find((c) => c.id === id);
    if (!comm) return { ok: false, error: "Komisi tidak ditemukan." };

    // Enforce state machine rule: PENDING cannot be directly marked PAID without approval!
    if (comm.status === "PENDING") {
      return { ok: false, error: "Komisi harus disetujui terlebih dahulu sebelum ditandai dibayar." };
    }
    if (comm.status === "PAID") {
      return { ok: true };
    }

    const delta = await getDemoCookieDelta();
    delta.modifiedCommissions = delta.modifiedCommissions || {};
    const now = new Date().toISOString();
    delta.modifiedCommissions[id] = {
      ...(delta.modifiedCommissions[id] || {}),
      status: "PAID",
      paidAt: now,
    };

    if (comm.leadId) {
      delta.extraActivities = delta.extraActivities || {};
      delta.extraActivities[comm.leadId] = delta.extraActivities[comm.leadId] || [];
      delta.extraActivities[comm.leadId].unshift({
        id: `act-comm-paid-${Date.now()}`,
        leadId: comm.leadId,
        type: "PAYMENT",
        message: `Komisi Rp${comm.amount.toLocaleString("id-ID")} ditandai sudah dibayar`,
        createdAt: now,
      });
    }

    await saveDemoCookieDelta(delta);
    return { ok: true };
  }

  async updateCommissionStatus(id: string, status: string) {
    if (status === "APPROVED") {
      return this.approveCommission(id);
    }
    if (status === "PAID") {
      return this.payCommission(id);
    }
    const delta = await getDemoCookieDelta();
    delta.modifiedCommissions = delta.modifiedCommissions || {};
    delta.modifiedCommissions[id] = {
      ...(delta.modifiedCommissions[id] || {}),
      status,
    };
    await saveDemoCookieDelta(delta);
    return { ok: true };
  }

  async createAffiliate(data: { name: string; code: string; phone?: string | null }) {
    const codeClean = data.code.trim().toUpperCase();
    const { affiliates } = await this.loadState();
    if (affiliates.some((a) => a.code.toUpperCase() === codeClean)) {
      return { ok: false, error: "Kode referral sudah digunakan." };
    }

    const delta = await getDemoCookieDelta();
    const now = new Date().toISOString();
    const newAff: Affiliate = {
      id: `aff-${Date.now()}`,
      name: data.name.trim(),
      code: codeClean,
      phone: data.phone ? normalizePhone(data.phone) : null,
      isActive: true,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    };

    delta.newAffiliates = [newAff, ...(delta.newAffiliates || [])];
    await saveDemoCookieDelta(delta);
    return { ok: true };
  }

  async resetDemo() {
    await saveDemoCookieDelta(null);
    return { ok: true };
  }
}

export class DatabaseRepository implements AffiliateRepository {
  private prisma: any;

  constructor(prismaClient: any) {
    this.prisma = prismaClient;
  }

  private async ensureSeeded() {
    try {
      const count = await this.prisma.affiliate.count();
      if (count === 0) {
        await this.seed();
      }
    } catch (e) {
      console.warn("Database auto-seed check failed:", e);
    }
  }

  private async seed() {
    try {
      await this.prisma.appSetting.upsert({
        where: { id: "default" },
        update: {},
        create: { id: "default", fixedAmount: 75000 },
      });
      for (const p of initialPrograms) {
        await this.prisma.program.upsert({
          where: { slug: p.slug },
          update: {},
          create: { name: p.name, slug: p.slug, description: p.description, price: p.price },
        });
      }
      for (const a of initialAffiliates) {
        await this.prisma.affiliate.upsert({
          where: { code: a.code },
          update: {},
          create: { name: a.name, code: a.code, phone: a.phone, clicks: a.clicks },
        });
      }
    } catch (e) {
      console.warn("Database auto-seed failed:", e);
    }
  }

  async getOverview() {
    await this.ensureSeeded();
    const [totalAffiliates, totalLeads, paidLeads, commissions, recentLeads, programs, allLeads] =
      await Promise.all([
        this.prisma.affiliate.count(),
        this.prisma.lead.count(),
        this.prisma.lead.count({ where: { status: "LUNAS" } }),
        this.prisma.commission.findMany(),
        this.prisma.lead.findMany({
          include: { program: true, affiliate: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        this.prisma.program.findMany(),
        this.prisma.lead.findMany({ include: { program: true } }),
      ]);

    const programsById = Object.fromEntries(programs.map((p: any) => [p.id, p]));
    const revenue = calculateTotalReferralRevenue(allLeads, programsById);
    const totalCommission = calculateGeneratedCommission(commissions);
    const pendingCommission = calculatePendingCommission(commissions);
    const approvedCommission = calculateApprovedCommission(commissions);
    const paidCommission = calculatePaidCommission(commissions);
    const netRevenue = calculateNetReferralRevenue(revenue, totalCommission);

    return {
      totalAffiliates,
      totalLeads,
      paidLeads,
      conversionRate: calculateConversionRate(paidLeads, totalLeads),
      totalCommission,
      pendingCommission,
      approvedCommission,
      paidCommission,
      revenue,
      netRevenue,
      recentLeads,
    };
  }

  async getAffiliates() {
    await this.ensureSeeded();
    return this.prisma.affiliate.findMany({
      include: { leads: { include: { commissions: true } } },
      orderBy: { name: "asc" },
    });
  }

  async getAffiliateById(id: string) {
    await this.ensureSeeded();
    return this.prisma.affiliate.findUnique({
      where: { id },
      include: {
        leads: { include: { program: true, commissions: true }, orderBy: { createdAt: "desc" } },
        commissions: true,
      },
    });
  }

  async getAffiliateByCode(code: string) {
    if (!code) return null;
    await this.ensureSeeded();
    return this.prisma.affiliate.findFirst({
      where: { code: code.trim().toUpperCase(), isActive: true },
    });
  }

  async getLeads(filters?: { search?: string; programId?: string; affiliateId?: string; status?: string }) {
    await this.ensureSeeded();
    const where: any = {};
    if (filters?.programId && filters.programId !== "Semua program") {
      where.programId = filters.programId;
    }
    if (filters?.affiliateId && filters.affiliateId !== "Semua affiliate") {
      where.affiliateId = filters.affiliateId;
    }
    if (filters?.status && filters.status !== "Semua status") {
      where.status = filters.status;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { phone: { contains: filters.search } },
      ];
    }
    return this.prisma.lead.findMany({
      where,
      include: { program: true, affiliate: true, commissions: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getLeadById(id: string) {
    await this.ensureSeeded();
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        program: true,
        affiliate: true,
        activities: { orderBy: { createdAt: "desc" } },
        commissions: true,
      },
    });
  }

  async getCommissions() {
    await this.ensureSeeded();
    return this.prisma.commission.findMany({
      include: { affiliate: true, lead: { include: { program: true } } },
      orderBy: { generatedAt: "desc" },
    });
  }

  async getPrograms() {
    await this.ensureSeeded();
    return this.prisma.program.findMany({ where: { active: true } });
  }

  async getProgramById(id: string) {
    await this.ensureSeeded();
    return this.prisma.program.findUnique({ where: { id } });
  }

  async getAppSetting() {
    await this.ensureSeeded();
    const s = await this.prisma.appSetting.findUnique({ where: { id: "default" } });
    return s || initialSetting;
  }

  async getManagementMetrics() {
    await this.ensureSeeded();
    const [affiliatesCount, leadsCount, paidLeads, commissions, programs] = await Promise.all([
      this.prisma.affiliate.count(),
      this.prisma.lead.count(),
      this.prisma.lead.findMany({ where: { status: "LUNAS" }, include: { program: true } }),
      this.prisma.commission.findMany(),
      this.prisma.program.findMany(),
    ]);

    const programsById = Object.fromEntries(programs.map((p: any) => [p.id, p]));
    const revenue = calculateTotalReferralRevenue(paidLeads, programsById);
    const affiliateCost = calculateGeneratedCommission(commissions);
    const pendingCost = calculatePendingCommission(commissions);
    const approvedCost = calculateApprovedCommission(commissions);
    const paidCost = calculatePaidCommission(commissions);
    const netRevenue = calculateNetReferralRevenue(revenue, affiliateCost);

    return {
      affiliatesCount,
      leadsCount,
      paidCount: paidLeads.length,
      conversionRate: calculateConversionRate(paidLeads.length, leadsCount),
      revenue,
      affiliateCost,
      pendingCost,
      approvedCost,
      paidCost,
      netRevenue,
    };
  }

  async getAffiliatePortal(code: string) {
    await this.ensureSeeded();
    const aff = await this.prisma.affiliate.findFirst({
      where: { code: code.trim().toUpperCase(), isActive: true },
      include: {
        leads: { include: { program: true, commissions: true }, orderBy: { createdAt: "desc" } },
        commissions: true,
      },
    });
    if (!aff) return null;

    const registeredCount = aff.leads.filter((l: any) =>
      ["DAFTAR", "MENUNGGU_PEMBAYARAN", "LUNAS"].includes(l.status)
    ).length;
    const paidCount = aff.leads.filter((l: any) => l.status === "LUNAS").length;
    const totalCommission = calculateGeneratedCommission(aff.commissions);
    const pendingCommission = calculatePendingCommission(aff.commissions);
    const paidCommission = calculatePaidCommission(aff.commissions);

    return {
      affiliate: aff,
      leads: aff.leads,
      commissions: aff.commissions,
      totalCommission,
      pendingCommission,
      paidCommission,
      registeredCount,
      paidCount,
    };
  }

  async createLead(input: CreateLeadInput) {
    await this.ensureSeeded();
    const affiliate = input.referralCode
      ? await this.prisma.affiliate.findFirst({
          where: { code: input.referralCode.trim().toUpperCase(), isActive: true },
        })
      : null;

    const lead = await this.prisma.lead.create({
      data: {
        name: input.name,
        phone: normalizePhone(input.phone),
        city: input.city,
        notes: input.notes || null,
        programId: input.programId,
        affiliateId: affiliate?.id,
        source: affiliate ? "REFERRAL_LINK" : "DIRECT",
        activities: {
          create: {
            type: "CREATED",
            message: affiliate
              ? `Referral masuk melalui kode ${affiliate.code}`
              : "Pendaftaran baru diterima",
          },
        },
      },
    });

    if (affiliate) {
      await this.prisma.referralClick.create({
        data: { affiliateId: affiliate.id, refCode: affiliate.code, sessionId: lead.id },
      });
      await this.prisma.affiliate.update({
        where: { id: affiliate.id },
        data: { clicks: { increment: 1 } },
      });
    }

    return { ok: true, leadId: lead.id };
  }

  async updateLeadStatus(id: string, status: LeadStatus) {
    await this.ensureSeeded();
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { program: true, affiliate: true },
    });
    if (!lead) return { ok: false };

    const data: any = { status };
    if (status === "LUNAS") data.paymentVerifiedAt = new Date();

    await this.prisma.lead.update({
      where: { id },
      data: {
        ...data,
        activities: {
          create: {
            type: "STATUS",
            message:
              status === "LUNAS"
                ? "Status diperbarui menjadi Lunas (Pembayaran Diverifikasi)"
                : `Admin mengubah status menjadi ${status.replaceAll("_", " ")}`,
          },
        },
      },
    });

    let commissionCreated = false;
    let commissionAmount = 0;

    // Check duplicate commission
    const existingCommission = await this.prisma.commission.findUnique({
      where: { leadId: id },
    });

    if (status === "LUNAS" && lead.affiliateId && !existingCommission) {
      const s = await this.prisma.appSetting.findUnique({ where: { id: "default" } });
      commissionAmount = calculateCommission(
        lead.registrationValue || lead.program.price,
        s?.commissionMethod || "FIXED",
        s?.fixedAmount || 75000,
        s?.percentage || 10
      );

      await this.prisma.commission.create({
        data: {
          leadId: id,
          affiliateId: lead.affiliateId,
          amount: commissionAmount,
          status: "PENDING",
        },
      });

      await this.prisma.leadActivity.create({
        data: {
          leadId: id,
          type: "COMMISSION",
          message: `Komisi Rp${commissionAmount.toLocaleString("id-ID")} diterbitkan untuk ${lead.affiliate?.name} (Menunggu Persetujuan)`,
        },
      });
      commissionCreated = true;
    }

    return { ok: true, commissionCreated, commissionAmount };
  }

  async updateLeadValue(id: string, value: number) {
    await this.ensureSeeded();
    await this.prisma.lead.update({
      where: { id },
      data: {
        registrationValue: value,
        activities: {
          create: {
            type: "PAYMENT",
            message: `Nilai kelas diperbarui menjadi Rp${value.toLocaleString("id-ID")}`,
          },
        },
      },
    });
    return { ok: true };
  }

  async approveCommission(id: string) {
    await this.ensureSeeded();
    const comm = await this.prisma.commission.findUnique({ where: { id } });
    if (!comm) return { ok: false, error: "Komisi tidak ditemukan." };
    if (comm.status !== "PENDING") {
      return { ok: false, error: "Hanya komisi dengan status Menunggu Persetujuan yang dapat disetujui." };
    }

    await this.prisma.commission.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    if (comm.leadId) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: comm.leadId,
          type: "COMMISSION",
          message: `Komisi Rp${comm.amount.toLocaleString("id-ID")} disetujui oleh admin`,
        },
      });
    }

    return { ok: true };
  }

  async payCommission(id: string) {
    await this.ensureSeeded();
    const comm = await this.prisma.commission.findUnique({ where: { id } });
    if (!comm) return { ok: false, error: "Komisi tidak ditemukan." };
    if (comm.status === "PENDING") {
      return { ok: false, error: "Komisi harus disetujui terlebih dahulu sebelum ditandai dibayar." };
    }

    await this.prisma.commission.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    if (comm.leadId) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: comm.leadId,
          type: "PAYMENT",
          message: `Komisi Rp${comm.amount.toLocaleString("id-ID")} ditandai sudah dibayar`,
        },
      });
    }

    return { ok: true };
  }

  async updateCommissionStatus(id: string, status: string) {
    if (status === "APPROVED") {
      return this.approveCommission(id);
    }
    if (status === "PAID") {
      return this.payCommission(id);
    }
    await this.ensureSeeded();
    await this.prisma.commission.update({
      where: { id },
      data: { status },
    });
    return { ok: true };
  }

  async createAffiliate(data: { name: string; code: string; phone?: string | null }) {
    await this.ensureSeeded();
    const code = data.code.trim().toUpperCase();
    try {
      await this.prisma.affiliate.create({
        data: {
          name: data.name.trim(),
          code,
          phone: data.phone ? normalizePhone(data.phone) : null,
        },
      });
      return { ok: true };
    } catch {
      return { ok: false, error: "Kode referral sudah digunakan." };
    }
  }

  async resetDemo() {
    return { ok: true };
  }
}

// Factory
let cachedMode: { mode: "production" | "demo"; database: "connected" | "demo" } = {
  mode: "demo",
  database: "demo",
};

export async function getRepository(): Promise<AffiliateRepository> {
  const isDemoExplicit = process.env.DEMO_MODE === "true";
  const dbUrl = process.env.DATABASE_URL;
  const isPostgresOrSqlite =
    dbUrl &&
    (dbUrl.startsWith("postgres://") ||
      dbUrl.startsWith("postgresql://") ||
      dbUrl.startsWith("file:"));

  if (isDemoExplicit || !isPostgresOrSqlite) {
    cachedMode = { mode: "demo", database: "demo" };
    return new DemoRepository();
  }

  try {
    const { getDb } = await import("../db");
    const dbClient = getDb();
    if (!dbClient) {
      cachedMode = { mode: "demo", database: "demo" };
      return new DemoRepository();
    }
    await dbClient.affiliate.count();
    cachedMode = { mode: "production", database: "connected" };
    return new DatabaseRepository(dbClient);
  } catch (e) {
    console.warn("DatabaseRepository unavailable, falling back gracefully to DemoRepository:", e);
    cachedMode = { mode: "demo", database: "demo" };
    return new DemoRepository();
  }
}

export function getRepositoryMode() {
  return cachedMode;
}
