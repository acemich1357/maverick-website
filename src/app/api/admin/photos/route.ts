import { NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = 'force-dynamic';
import { photos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allPhotos = await db.select().from(photos).orderBy(photos.slot);
    return NextResponse.json({ photos: allPhotos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { slot, url, alt } = await request.json();

    await db
      .update(photos)
      .set({ url, alt, updatedAt: new Date() })
      .where(eq(photos.slot, slot));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slot = parseInt(searchParams.get("slot") || "0");

    await db
      .update(photos)
      .set({ url: "", alt: "", updatedAt: new Date() })
      .where(eq(photos.slot, slot));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
