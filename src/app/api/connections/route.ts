import { NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = 'force-dynamic';
import { connectionRequests } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;
    const linkedin = data.get("linkedin") as string;
    const twitter = data.get("twitter") as string;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await db.insert(connectionRequests).values({
      name,
      email,
      message: message || "",
      linkedin: linkedin || "",
      twitter: twitter || "",
      status: "pending" as const,
      createdAt: Math.floor(Date.now() / 1000),
    });

    return NextResponse.redirect(new URL("/", request.url) + "?success=true");
  } catch (error) {
    console.error("Error saving connection request:", error);
    return NextResponse.json({ error: "Failed to save connection request" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(connectionRequests)
      .orderBy(connectionRequests.createdAt);
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }
}