export const money = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const date = (value: Date | string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function getAppUrl(): string {
  // 1. Explicit environment variable
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }

  // 2. Vercel deployment URLs (server-side runtime)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  // 3. Client-side browser runtime detection
  if (typeof window !== "undefined" && window.location?.origin) {
    if (!window.location.origin.includes("localhost") && !window.location.origin.includes("127.0.0.1")) {
      return window.location.origin;
    }
  }

  // 4. Production environment fallback
  if (process.env.NODE_ENV === "production") {
    return "https://ahlan-affiliate.vercel.app";
  }

  // 5. Local development fallback
  return envUrl || "http://localhost:3000";
}

export const appUrl = getAppUrl;
