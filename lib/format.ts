export const money = (value = 0) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
export const date = (value: Date | string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
export const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
