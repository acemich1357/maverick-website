import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, photos, projects, blogPosts, timelineEvents } from "@/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, allPhotos, allProjects, allPosts, allEvents] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(photos).orderBy(photos.slot),
      db.select().from(projects).orderBy(projects.order),
      db.select().from(blogPosts).orderBy(blogPosts.order),
      db.select().from(timelineEvents).orderBy(timelineEvents.order),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      settings: settingsMap,
      photos: allPhotos,
      projects: allProjects,
      posts: allPosts,
      events: allEvents,
    });
  } catch (error) {
    console.error("Error fetching site data:", error);
    return NextResponse.json({ error: "Failed to fetch site data" }, { status: 500 });
  }
}
