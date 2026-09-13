import { describe, expect, it, beforeEach } from "vitest";
import { DemoRepository } from "../lib/repository";

describe("DemoRepository Business Flow & Data Integrity", () => {
  let repo: DemoRepository;

  beforeEach(async () => {
    repo = new DemoRepository();
    await repo.resetDemo();
  });

  describe("Referral Resolution", () => {
    it("resolves NAUFAL code to Naufal Nabila", async () => {
      const aff = await repo.getAffiliateByCode("NAUFAL");
      expect(aff).not.toBeNull();
      expect(aff?.name).toBe("Naufal Nabila");
      expect(aff?.code).toBe("NAUFAL");
    });

    it("resolves lowercase or padded referral codes safely", async () => {
      const aff = await repo.getAffiliateByCode("  naufal  ");
      expect(aff).not.toBeNull();
      expect(aff?.code).toBe("NAUFAL");
    });

    it("returns null for non-existent referral codes without crashing", async () => {
      const aff = await repo.getAffiliateByCode("KODE_TIDAK_ADA_999");
      expect(aff).toBeNull();
    });

    it("returns null for empty referral code safely", async () => {
      const aff = await repo.getAffiliateByCode("");
      expect(aff).toBeNull();
    });
  });

  describe("Registration & Attribution Preservation", () => {
    it("preserves affiliate attribution when creating a lead with valid code", async () => {
      const res = await repo.createLead({
        name: "Santri Baru",
        phone: "081298765432",
        city: "Jakarta",
        programId: "prog-ammiyah-saudi",
        referralCode: "NAUFAL",
      });

      expect(res.ok).toBe(true);
      expect(res.leadId).toBeDefined();

      const created = await repo.getLeadById(res.leadId!);
      expect(created).not.toBeNull();
      expect(created?.name).toBe("Santri Baru");
      expect(created?.phone).toBe("6281298765432");
      expect(created?.source).toBe("REFERRAL_LINK");
      expect(created?.affiliateId).toBe("aff-naufal");
      expect(created?.affiliate?.name).toBe("Naufal Nabila");
    });

    it("creates direct lead when no referral code is supplied", async () => {
      const res = await repo.createLead({
        name: "Santri Mandiri",
        phone: "085712345678",
        city: "Bandung",
        programId: "prog-dasar",
      });

      expect(res.ok).toBe(true);
      const created = await repo.getLeadById(res.leadId!);
      expect(created?.source).toBe("DIRECT");
      expect(created?.affiliateId).toBeNull();
    });
  });

  describe("Commission Generation & Duplicate Protection", () => {
    it("generates exactly ONE commission when a qualifying lead reaches LUNAS", async () => {
      // Create a lead attributed to Naufal
      const res = await repo.createLead({
        name: "Calon Sukses",
        phone: "081311223344",
        city: "Depok",
        programId: "prog-ammiyah-saudi",
        referralCode: "NAUFAL",
      });
      const leadId = res.leadId!;

      // Change status to LUNAS
      const update1 = await repo.updateLeadStatus(leadId, "LUNAS");
      expect(update1.ok).toBe(true);
      expect(update1.commissionCreated).toBe(true);
      expect(update1.commissionAmount).toBe(75000);

      // Verify commission exists
      const commissions1 = await repo.getCommissions();
      const leadComms1 = commissions1.filter((c) => c.leadId === leadId);
      expect(leadComms1.length).toBe(1);
      expect(leadComms1[0].amount).toBe(75000);
      expect(leadComms1[0].status).toBe("PENDING");

      // CRITICAL DUPLICATE PROTECTION: Moving to LUNAS a second time must NOT create another commission
      const update2 = await repo.updateLeadStatus(leadId, "LUNAS");
      expect(update2.ok).toBe(true);
      expect(update2.commissionCreated).toBe(false);

      const commissions2 = await repo.getCommissions();
      const leadComms2 = commissions2.filter((c) => c.leadId === leadId);
      expect(leadComms2.length).toBe(1);
    });

    it("allows updating commission status to PAID", async () => {
      const comms = await repo.getCommissions();
      const pending = comms.find((c) => c.status === "PENDING");
      expect(pending).toBeDefined();

      const payRes = await repo.payCommission(pending!.id);
      expect(payRes.ok).toBe(true);

      const updatedComms = await repo.getCommissions();
      const paidComm = updatedComms.find((c) => c.id === pending!.id);
      expect(paidComm?.status).toBe("PAID");
    });
  });

  describe("Demo Reset Functionality", () => {
    it("restores modified leads and commissions back to initial demo state", async () => {
      // Modify Suyadi lead
      await repo.updateLeadStatus("lead-suyadi", "LUNAS");
      let suyadi = await repo.getLeadById("lead-suyadi");
      expect(suyadi?.status).toBe("LUNAS");

      // Reset
      await repo.resetDemo();

      suyadi = await repo.getLeadById("lead-suyadi");
      expect(suyadi?.status).toBe("DIHUBUNGI");
    });
  });
});
