"use server";

import { getRepository } from "@/lib/repository";
import { leadSchema } from "@/lib/validation";
import { leadStatuses, type LeadStatus } from "@/lib/domain";
import { revalidatePath } from "next/cache";

export async function submitLead(form: FormData) {
  try {
    const rawData = Object.fromEntries(form);
    const parsed = leadSchema.safeParse(rawData);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "Input tidak valid" };
    }

    const d = parsed.data;
    const repo = await getRepository();
    const result = await repo.createLead({
      name: d.name.trim(),
      phone: d.phone.trim(),
      city: d.city.trim(),
      programId: d.programId,
      notes: d.notes?.trim() || null,
      referralCode: d.referralCode?.trim() || null,
    });

    if (result.ok) {
      revalidatePath("/admin");
      revalidatePath("/admin/leads");
      revalidatePath("/affiliate");
    }
    return result;
  } catch (e: any) {
    console.error("submitLead error:", e);
    return { ok: false, error: "Gagal mengirim data pendaftaran. Silakan coba lagi." };
  }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<{ ok: boolean; commissionCreated?: boolean; commissionAmount?: number; error?: string }> {
  try {
    if (!leadStatuses.includes(status)) {
      return { ok: false, error: "Status tidak valid" };
    }
    const repo = await getRepository();
    const res = await repo.updateLeadStatus(id, status);

    revalidatePath("/admin");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin/commissions");
    revalidatePath("/affiliate");
    revalidatePath("/management");
    return res;
  } catch (e: any) {
    console.error("updateLeadStatus error:", e);
    return { ok: false, error: "Gagal memperbarui status lead." };
  }
}

export async function updateLeadValue(id: string, value: number) {
  try {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      return { ok: false, error: "Nilai kelas tidak valid" };
    }
    const repo = await getRepository();
    const res = await repo.updateLeadValue(id, num);

    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return res;
  } catch (e: any) {
    console.error("updateLeadValue error:", e);
    return { ok: false, error: "Gagal memperbarui nilai kelas." };
  }
}

export async function approveCommission(id: string) {
  try {
    const repo = await getRepository();
    const res = await repo.approveCommission(id);

    revalidatePath("/admin/commissions");
    revalidatePath("/admin");
    revalidatePath("/affiliate");
    revalidatePath("/management");
    return res;
  } catch (e: any) {
    console.error("approveCommission error:", e);
    return { ok: false, error: "Gagal menyetujui komisi." };
  }
}

export async function payCommission(id: string) {
  try {
    const repo = await getRepository();
    const res = await repo.payCommission(id);

    revalidatePath("/admin/commissions");
    revalidatePath("/admin");
    revalidatePath("/affiliate");
    revalidatePath("/management");
    return res;
  } catch (e: any) {
    console.error("payCommission error:", e);
    return { ok: false, error: "Gagal mencatat pembayaran komisi." };
  }
}

export async function updateCommissionStatus(id: string, status: string) {
  try {
    const repo = await getRepository();
    const res = await repo.updateCommissionStatus(id, status);

    revalidatePath("/admin/commissions");
    revalidatePath("/admin");
    revalidatePath("/affiliate");
    return res;
  } catch (e: any) {
    console.error("updateCommissionStatus error:", e);
    return { ok: false, error: "Gagal memperbarui status komisi." };
  }
}

export async function createAffiliate(form: FormData) {
  try {
    const name = String(form.get("name") || "").trim();
    const code = String(form.get("code") || "").trim().toUpperCase();
    const phone = String(form.get("phone") || "").trim() || null;

    if (name.length < 2 || !/^[-A-Z0-9]{3,20}$/.test(code)) {
      return { ok: false, error: "Nama minimal 2 huruf dan kode referral 3-20 karakter alfanumerik." };
    }

    const repo = await getRepository();
    const res = await repo.createAffiliate({ name, code, phone });

    if (res.ok) {
      revalidatePath("/admin/affiliates");
      revalidatePath("/admin");
    }
    return res;
  } catch (e: any) {
    console.error("createAffiliate error:", e);
    return { ok: false, error: "Gagal mendaftarkan affiliate baru." };
  }
}

export async function resetDemoAction() {
  try {
    const repo = await getRepository();
    const res = await repo.resetDemo();

    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/affiliates");
    revalidatePath("/admin/commissions");
    revalidatePath("/affiliate");
    revalidatePath("/management");
    revalidatePath("/demo");
    return res;
  } catch (e: any) {
    console.error("resetDemoAction error:", e);
    return { ok: false, error: "Gagal mereset demo." };
  }
}

export async function setDemoRoleAction(role: "admin" | "affiliate" | "management") {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set("ahlan_demo_role", role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false,
    });
    return { ok: true };
  } catch (e) {
    console.error("setDemoRoleAction error:", e);
    return { ok: false };
  }
}

