import { NextResponse } from "next/server";
import { getRepository, getRepositoryMode } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const repo = await getRepository();
    // Verify repository responsiveness
    await repo.getPrograms();
    const modeInfo = getRepositoryMode();

    return NextResponse.json({
      status: "ok",
      app: "ahlan-affiliate",
      database: modeInfo.database,
      mode: modeInfo.mode,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        status: "error",
        app: "ahlan-affiliate",
        database: "error",
        mode: "degraded",
        message: "Health check encountered an error.",
      },
      { status: 500 }
    );
  }
}
