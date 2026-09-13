import { describe, expect, it } from "vitest";
import {
  calculateCommission,
  conversion,
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
});
