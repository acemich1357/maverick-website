export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/db";
import { timelineEvents } from "@/db/schema";

export async function GET() {
  try {
    const events = await db.select().from(timelineEvents).orderBy(timelineEvents.order);
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}
