import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Mobile Layout & Overflow Prevention Audit", () => {
  const cssPath = path.join(process.cwd(), "app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("does not use hacky global overflow-x: hidden on body/html", () => {
    // The prompt strictly forbids fixing overflow using global body { overflow-x: hidden; }
    expect(cssContent).not.toMatch(/body\s*\{[^}]*overflow-x:\s*hidden/);
    expect(cssContent).not.toMatch(/html\s*\{[^}]*overflow-x:\s*hidden/);
  });

  it("defines responsive breakpoints for tablet (<1024px), mobile (<768px), and small mobile (<360px)", () => {
    expect(cssContent).toContain("@media (max-width: 1023px)");
    expect(cssContent).toContain("@media (max-width: 768px)");
    expect(cssContent).toContain("@media (max-width: 640px)");
    expect(cssContent).toContain("@media (max-width: 360px)");
  });

  it("ensures grid children allow min-width: 0 to prevent flex/grid blowouts", () => {
    expect(cssContent).toContain(".grid > *");
    expect(cssContent).toContain("min-width: 0");
  });

  it("stacks the .two layout vertically below 1024px", () => {
    // In max-width: 1023px, .two must be 1fr, NOT repeat(2, 1fr)
    const tabletQueryMatch = cssContent.match(/@media\s*\(max-width:\s*1023px\)\s*\{([\s\S]*?)\n\}/);
    expect(tabletQueryMatch).not.toBeNull();
    const queryBlock = tabletQueryMatch ? tabletQueryMatch[1] : "";
    expect(queryBlock).toContain(".two");
    expect(queryBlock).toContain("grid-template-columns: 1fr");
  });

  it("sets 2-column KPI grid on mobile and fluid metric sizing", () => {
    const tabletQueryMatch = cssContent.match(/@media\s*\(max-width:\s*1023px\)\s*\{([\s\S]*?)\n\}/);
    const queryBlock = tabletQueryMatch ? tabletQueryMatch[1] : "";
    expect(queryBlock).toContain(".kpis");
    expect(queryBlock).toContain("repeat(2, minmax(0, 1fr))");
  });

  it("configures table-to-card responsive visibility helpers", () => {
    expect(cssContent).toContain(".desktop-table-view");
    expect(cssContent).toContain(".mobile-cards-view");
  });

  it("checks that app/admin/page.tsx does not have hardcoded inline 4-column grid", () => {
    const adminPage = fs.readFileSync(path.join(process.cwd(), "app/admin/page.tsx"), "utf-8");
    expect(adminPage).not.toContain('gridTemplateColumns: "repeat(4, 1fr)"');
    expect(adminPage).not.toContain("repeat(4, 1fr)");
  });

  it("checks that app/admin/commissions/page.tsx does not have hardcoded inline 4-column grid", () => {
    const commissionsPage = fs.readFileSync(path.join(process.cwd(), "app/admin/commissions/page.tsx"), "utf-8");
    expect(commissionsPage).not.toContain('gridTemplateColumns: "repeat(4, 1fr)"');
    expect(commissionsPage).not.toContain("repeat(4, 1fr)");
  });

  it("checks that components/ui.tsx contains dedicated mobile-topbar and 4-tab mobile bottom nav", () => {
    const ui = fs.readFileSync(path.join(process.cwd(), "components/ui.tsx"), "utf-8");
    expect(ui).toContain("mobile-topbar");
    expect(ui).toContain("mobile-nav");
    expect(ui).toContain("MobileMenuDrawer");
    expect(ui).toContain("Ringkasan");
    expect(ui).toContain("Peserta");
    expect(ui).toContain("Affiliate");
    expect(ui).toContain("Komisi");
  });

  it("checks that /admin/leads, /admin/affiliates, and /admin/commissions render mobile cards view", () => {
    const leads = fs.readFileSync(path.join(process.cwd(), "app/admin/leads/leads-table-client.tsx"), "utf-8");
    const affiliates = fs.readFileSync(path.join(process.cwd(), "app/admin/affiliates/page.tsx"), "utf-8");
    const commissions = fs.readFileSync(path.join(process.cwd(), "app/admin/commissions/page.tsx"), "utf-8");

    expect(leads).toContain("mobile-cards-view");
    expect(affiliates).toContain("mobile-cards-view");
    expect(commissions).toContain("mobile-cards-view");
  });
});
