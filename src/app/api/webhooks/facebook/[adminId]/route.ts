import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Facebook Lead Ads webhook endpoint - per-admin route
// URL: /api/webhooks/facebook/[adminId]

export async function GET(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");

  if (mode !== "subscribe") {
    return new NextResponse("Invalid mode", { status: 400 });
  }

  // Verify admin exists and is active
  const admin = await prisma.user.findFirst({
    where: { 
      id: params.adminId, 
      role: "ADMIN",
      status: "ACTIVE" 
    },
    select: { id: true }
  });

  if (!admin) {
    return new NextResponse("Admin not found or inactive", { status: 404 });
  }

  // Facebook sends the challenge back for verification
  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Missing challenge", { status: 400 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    // 1. Verify admin exists and is active
    const admin = await prisma.user.findFirst({
      where: { 
        id: params.adminId, 
        role: "ADMIN",
        status: "ACTIVE" 
      },
      select: { id: true }
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found or inactive" }, { status: 404 });
    }

    const body = await request.json();
    
    // Facebook sends leadgen_id in real webhooks
    // For direct POST integration, we accept lead data directly
    const { name, phone, email, city, leadgen_id } = body;
    
    // Validation
    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }
    
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
    
    if (normalizedPhone.length !== 10) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
    }
    
    // 3. Upsert lead - adminId from URL params only
    const lead = await prisma.lead.upsert({
      where: {
        adminId_phone: {
          adminId: params.adminId,
          phone: normalizedPhone,
        },
      },
      update: {
        name: name || "Facebook Lead",
        email: email || null,
        city: city || null,
        status: "NEW",
        updatedAt: new Date(),
      },
      create: {
        adminId: params.adminId,
        name: name || "Facebook Lead",
        phone: normalizedPhone,
        email: email || null,
        city: city || null,
        source: "FACEBOOK",
        status: "NEW",
      },
    });
    
    // 4. Log activity
    await prisma.activityLog.create({
      data: {
        userId: params.adminId,
        leadId: lead.id,
        action: "FACEBOOK_LEAD_CAPTURED",
        details: { 
          leadgen_id: leadgen_id || null,
          phone: normalizedPhone 
        },
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      action: lead.createdAt.getTime() === lead.updatedAt.getTime() ? "created" : "updated"
    });
    
  } catch (error) {
    console.error("Facebook webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
