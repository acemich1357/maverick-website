import { NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = 'force-dynamic';
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();

    for (const [key, value] of Object.entries(settings)) {
      await db
        .insert(siteSettings)
        .values({ key, value: value as string })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: value as string, updatedAt: new Date() },
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
