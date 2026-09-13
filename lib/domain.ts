export type LeadStatus = "LEAD_BARU"|"DIHUBUNGI"|"FOLLOW_UP"|"TERTARIK"|"DAFTAR"|"MENUNGGU_PEMBAYARAN"|"LUNAS"|"BATAL";
export const leadStatuses: LeadStatus[] = ["LEAD_BARU","DIHUBUNGI","FOLLOW_UP","TERTARIK","DAFTAR","MENUNGGU_PEMBAYARAN","LUNAS","BATAL"];
export const labels: Record<string,string> = { LEAD_BARU:"Lead Baru", DIHUBUNGI:"Sudah Dihubungi", FOLLOW_UP:"Follow Up", TERTARIK:"Tertarik", DAFTAR:"Sudah Daftar", MENUNGGU_PEMBAYARAN:"Menunggu Pembayaran", LUNAS:"Lunas", BATAL:"Batal" };
export function normalizePhone(phone: string) { const d = phone.replace(/[^\d+]/g, "").replace(/^\+/, ""); if (d.startsWith("0")) return `62${d.slice(1)}`; return d.startsWith("62") ? d : d; }
export function calculateCommission(value: number, method: string, fixed: number, percentage: number) { return method === "FIXED" ? fixed : Math.round(value * percentage / 100); }
export function conversion(paid: number, leads: number) { return leads ? Math.round((paid / leads) * 100) : 0; }
export function simulation(price:number, affiliates:number, perAffiliate:number, rate:number, type:"FIXED"|"PERCENTAGE", commission:number) { const leads=affiliates*perAffiliate, students=Math.round(leads*rate/100), gross=students*price, cost=type==="FIXED"?students*commission:Math.round(gross*commission/100); return {leads,students,gross,cost,net:gross-cost}; }
