import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

// 1. GET: Settings load karne ke liye
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        { message: "owner id is required" },
        { status: 400 }
      );
    }

    await connectDb();

    const setting = await Settings.findOne({ ownerId });

    // Agar setting nahi mili (naya user), tab bhi 200 OK bhejo with null taaki page na tute
    return NextResponse.json({
      success: true,
      setting: setting || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: `get settings error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

// 2. POST: Settings save/update karne ke liye
export async function POST(req: NextRequest) {
  try {
    const { ownerId, businessName, supportEmail, knowledge } = await req.json();

    if (!ownerId) {
      return NextResponse.json(
        { message: "owner id is required" },
        { status: 400 }
      );
    }

    await connectDb();

    // Correct spelling: businessName
    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      setting: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: `settings error: ${error?.message || error}` },
      { status: 500 }
    );
  }
}