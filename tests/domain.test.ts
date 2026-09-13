import { describe, expect, it } from "vitest";
import {
  calculateCommission,
  calculateTotalReferralRevenue,
  calculateGeneratedCommission,
  calculatePendingCommission,
  calculateApprovedCommission,
  calculatePaidCommission,
  calculateNetReferralRevenue,
  conversion,
  maskPhone,
  normalizePhone,
  simulation,
} from "../lib/domain";
import { leadSchema } from "../lib/validation";

describe("Business Logic & Calculations", () => {
  describe("Phone Normalization", () => {
    it("normalizes standard 08... phone numbers", () => {
      expect(normalizePhone("0812-1234-8454")).toBe("6281212348454");
      expect(normalizePhone("081234567890")).toBe("6281234567890");
    });

    it("normalizes international +628... phone numbers", () => {
      expect(normalizePhone("+6281212348454")).toBe("6281212348454");
      expect(normalizePhone("+62 812-1234-8454")).toBe("6281212348454");
    });

    it("preserves already normalized 628... phone numbers", () => {
      expect(normalizePhone("6281212348454")).toBe("6281212348454");
    });
  });

  describe("Commission Calculation", () => {
    it("calculates fixed amount correctly", () => {
      expect(calculateCommission(500000, "FIXED", 75000, 10)).toBe(75000);
      expect(calculateCommission(750000, "FIXED", 100000, 15)).toBe(100000);
    });

    it("calculates percentage amount correctly", () => {
      expect(calculateCommission(500000, "PERCENTAGE", 75000, 10)).toBe(50000);
      expect(calculateCommission(450000, "PERCENTAGE", 75000, 15)).toBe(67500);
    });
  });

  describe("Conversion Rate", () => {
    it("calculates conversion rate rounded to nearest integer", () => {
      expect(conversion(29, 41)).toBe(71);
      expect(conversion(1, 3)).toBe(33);
    });

    it("handles zero leads safely without division by zero", () => {
      expect(conversion(0, 0)).toBe(0);
      expect(conversion(5, 0)).toBe(0);
    });
  });

  describe("Program Economics Simulation", () => {
    it("simulates percentage commission correctly", () => {
      const res = simulation(500000, 100, 3, 30, "PERCENTAGE", 10);
      expect(res).toEqual({
        leads: 300,
        students: 90,
        gross: 45000000,
        cost: 4500000,
        net: 40500000,
      });
    });

    it("simulates fixed commission correctly", () => {
      const res = simulation(500000, 50, 4, 25, "FIXED", 75000);
      expect(res).toEqual({
        leads: 200,
        students: 50,
        gross: 25000000,
        cost: 3750000,
        net: 21250000,
      });
    });
  });

  describe("Lead Validation Schema", () => {
    it("accepts valid lead input", () => {
      const valid = {
        name: "Suyadi",
        phone: "081234567890",
        city: "Bandung",
        programId: "prog-ammiyah-saudi",
        referralCode: "NAUFAL",
      };
      const parse = leadSchema.safeParse(valid);
      expect(parse.success).toBe(true);
    });

    it("rejects names shorter than 2 characters", () => {
      const invalid = {
        name: "A",
        phone: "081234567890",
        city: "Bandung",
        programId: "prog-ammiyah-saudi",
      };
      const parse = leadSchema.safeParse(invalid);
      expect(parse.success).toBe(false);
    });

    it("rejects phone numbers shorter than 9 digits", () => {
      const invalid = {
        name: "Suyadi",
        phone: "123",
        city: "Bandung",
        programId: "prog-ammiyah-saudi",
      };
      const parse = leadSchema.safeParse(invalid);
      expect(parse.success).toBe(false);
    });
  });

  describe("Phone Masking", () => {
    it("masks phone numbers correctly for public affiliate portal", () => {
      expect(maskPhone("628120000001")).toBe("0812••••0001");
      expect(maskPhone("081234567890")).toBe("0812••••7890");
    });
  });

  describe("Domain Financial Calculations & Mathematical Integrity", () => {
    const paidLeads = [
      { id: "1", status: "LUNAS", registrationValue: 450000 }, // Ahmad Pratama
      { id: "2", status: "LUNAS", registrationValue: 450000 }, // Zaid Akbar
      { id: "3", status: "LUNAS", registrationValue: 500000 }, // Rahma Anjani
      { id: "4", status: "LUNAS", registrationValue: 500000 }, // Rizky Hidayat
      { id: "5", status: "DIHUBUNGI", registrationValue: 500000 }, // Suyadi (not lunas)
    ];

    const commissions = [
      { id: "c1", amount: 75000, status: "PAID" },
      { id: "c2", amount: 75000, status: "APPROVED" },
      { id: "c3", amount: 75000, status: "PENDING" },
      { id: "c4", amount: 75000, status: "PENDING" },
      { id: "c5", amount: 75000, status: "CANCELLED" },
    ];

    it("calculates exactly Rp1.900.000 gross revenue from the 4 paid students", () => {
      const gross = calculateTotalReferralRevenue(paidLeads);
      expect(gross).toBe(1900000);
    });

    it("calculates exactly Rp300.000 total generated commission from active commissions", () => {
      const generated = calculateGeneratedCommission(commissions);
      expect(generated).toBe(300000);
    });

    it("calculates exactly Rp1.600.000 net referral revenue", () => {
      const gross = calculateTotalReferralRevenue(paidLeads);
      const commissionCost = calculateGeneratedCommission(commissions);
      const net = calculateNetReferralRevenue(gross, commissionCost);
      expect(net).toBe(1600000);
    });

    it("calculates pending, approved, and paid commissions without double-counting", () => {
      expect(calculatePaidCommission(commissions)).toBe(75000);
      expect(calculateApprovedCommission(commissions)).toBe(75000);
      expect(calculatePendingCommission(commissions)).toBe(150000);
      expect(
        calculatePaidCommission(commissions) +
          calculateApprovedCommission(commissions) +
          calculatePendingCommission(commissions)
      ).toBe(300000);
    });
  });

  describe("Production URL Resolution (P0-3)", () => {
    it("never returns localhost when NEXT_PUBLIC_APP_URL is configured for production", async () => {
      const { getAppUrl } = await import("../lib/format");
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      try {
        process.env.NEXT_PUBLIC_APP_URL = "https://ahlan-affiliate.vercel.app";
        const url = getAppUrl();
        expect(url).toBe("https://ahlan-affiliate.vercel.app");
        expect(url).not.toContain("localhost");
      } finally {
        process.env.NEXT_PUBLIC_APP_URL = originalEnv;
      }
    });

    it("falls back to canonical domain in production mode if env is unset", async () => {
      const { getAppUrl } = await import("../lib/format");
      const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
      const originalNodeEnv = process.env.NODE_ENV;
      try {
        delete process.env.NEXT_PUBLIC_APP_URL;
        // @ts-expect-error test override
        process.env.NODE_ENV = "production";
        const url = getAppUrl();
        expect(url).toBe("https://ahlan-affiliate.vercel.app");
        expect(url).not.toContain("localhost");
      } finally {
        process.env.NEXT_PUBLIC_APP_URL = originalEnv;
        // @ts-expect-error test override
        process.env.NODE_ENV = originalNodeEnv;
      }
    });
  });
});
