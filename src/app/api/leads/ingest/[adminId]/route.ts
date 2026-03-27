import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API endpoint for lead ingestion - per-admin route
// URL: /api/leads/ingest/[adminId]
// Security: Anyone with the URL can POST leads for this admin

export async function POST(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    // 1. Validate adminId from URL
    const admin = await prisma.user.findFirst({
      where: { 
        id: params.adminId, 
        role: "ADMIN",
        status: "ACTIVE" 
      },
      select: { id: true }
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found or inactive" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // 2. Validate required fields
    if (!data.phone || !data.name) {
      return NextResponse.json(
        { error: "Phone and name are required" },
        { status: 400 }
      );
    }

    // Validate phone format (10-15 digits)
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Phone must be 10-15 digits" },
        { status: 400 }
      );
    }

    // Normalize phone
    const normalizedPhone = phoneDigits.slice(-10);

    // 3. Upsert lead - adminId from URL only, never from body
    const lead = await prisma.lead.upsert({
      where: {
        adminId_phone: {
          adminId: params.adminId,
          phone: normalizedPhone,
        },
      },
      update: {
        name: data.name,
        email: data.email || null,
        city: data.city || null,
        updatedAt: new Date(),
      },
      create: {
        adminId: params.adminId,
        name: data.name,
        phone: normalizedPhone,
        email: data.email || null,
        city: data.city || null,
        source: data.source || "API",
        status: "NEW",
      },
    });

    // 4. Log activity
    await prisma.activityLog.create({
      data: {
        userId: params.adminId,
        leadId: lead.id,
        action: "LEAD_INGESTED",
        details: { 
          source: data.source || "API",
          phone: normalizedPhone 
        },
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      action: lead.createdAt.getTime() === lead.updatedAt.getTime() ? "created" : "updated",
    });

  } catch (error) {
    console.error("Lead ingestion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  return NextResponse.json({
    message: "Lead ingestion endpoint",
    adminId: params.adminId,
    usage: "POST with {name, phone, email?, city?, source?}",
    note: "adminId is taken from URL, not body",
  });
}
