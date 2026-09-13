import { z } from "zod";
export const leadSchema = z.object({ name:z.string().min(2,"Nama minimal 2 karakter"), phone:z.string().min(9,"Nomor WhatsApp belum valid"), city:z.string().min(2,"Domisili wajib diisi"), programId:z.string().min(1,"Pilih program"), notes:z.string().max(500).optional(), referralCode:z.string().optional() });
