import "./globals.css";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title:"Ahlan Affiliate", description:"Sistem referral Ahlan Les Bahasa Arab" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
