import { describe, expect, it } from "vitest";
import { getRepository } from "../lib/repository";
import { GET as healthCheck } from "../app/api/health/route";

describe("Production Smoke Tests", () => {
  it("health check endpoint returns HTTP 200 with status ok", async () => {
    const res = await healthCheck();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.app).toBe("ahlan-affiliate");
    expect(data.mode).toBeDefined();
    expect(data.database).toBeDefined();
  });

  it("admin overview loads all required metrics without exception", async () => {
    const repo = await getRepository();
    const overview = await repo.getOverview();
    expect(overview.totalAffiliates).toBeGreaterThan(0);
    expect(overview.totalLeads).toBeGreaterThan(0);
    expect(Array.isArray(overview.recentLeads)).toBe(true);
  });

  it("registration with referral NAUFAL resolves correctly", async () => {
    const repo = await getRepository();
    const affiliate = await repo.getAffiliateByCode("NAUFAL");
    expect(affiliate).not.toBeNull();
    expect(affiliate?.name).toBe("Naufal Nabila");
  });

  it("registration with invalid referral returns null safely", async () => {
    const repo = await getRepository();
    const affiliate = await repo.getAffiliateByCode("NON_EXISTENT_CODE");
    expect(affiliate).toBeNull();
  });

  it("affiliate portal loads Naufal's metrics and referral list", async () => {
    const repo = await getRepository();
    const portal = await repo.getAffiliatePortal("NAUFAL");
    expect(portal).not.toBeNull();
    expect(portal?.affiliate.code).toBe("NAUFAL");
    expect(portal?.leads.length).toBeGreaterThan(0);
    expect(portal?.totalCommission).toBeGreaterThanOrEqual(0);
  });

  it("management overview loads accurate economic calculations", async () => {
    const repo = await getRepository();
    const mgmt = await repo.getManagementMetrics();
    expect(mgmt.affiliatesCount).toBeGreaterThan(0);
    expect(mgmt.leadsCount).toBeGreaterThan(0);
    expect(mgmt.revenue).toBeGreaterThan(0);
    expect(mgmt.netRevenue).toBe(mgmt.revenue - mgmt.affiliateCost);
  });

  it("admin leads detail for Suyadi returns all relations", async () => {
    const repo = await getRepository();
    const lead = await repo.getLeadById("lead-suyadi");
    expect(lead).not.toBeNull();
    expect(lead?.name).toBe("Suyadi");
    expect(lead?.program).toBeDefined();
    expect(lead?.affiliate).toBeDefined();
    expect(Array.isArray(lead?.activities)).toBe(true);
  });

  it("commissions route data loads cleanly", async () => {
    const repo = await getRepository();
    const comms = await repo.getCommissions();
    expect(Array.isArray(comms)).toBe(true);
    expect(comms.length).toBeGreaterThan(0);
  });
});
