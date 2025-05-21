import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Stage } from "@prisma/client";

const prisma = new PrismaClient();
const allowedStages = ["NEW", "CONTACTED", "CONVERTED", "LOST"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/leads - List all leads
export async function GET() {
  const leads = await prisma.lead.findMany({
    include: { conversations: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(leads);
}

// POST /api/leads - Create a new lead
export async function POST(req: NextRequest) {
  try {
    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      console.error("Error parsing request body:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Backend validation
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }
    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: "Email is not valid." },
        { status: 400 }
      );
    }
    if (
      !data.company ||
      typeof data.company !== "string" ||
      !data.company.trim()
    ) {
      return NextResponse.json(
        { error: "Company is required." },
        { status: 400 }
      );
    }
    if (!data.stage || !allowedStages.includes(data.stage)) {
      return NextResponse.json(
        { error: "Stage is required and must be valid." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        linkedIn: data.linkedIn?.trim() || "",
        notes: data.notes?.trim() || "",
        tags: data.tags || [],
        stage: data.stage as Stage,
        nextFollowUp: data.nextFollowUp && !isNaN(Date.parse(data.nextFollowUp)) ? new Date(data.nextFollowUp) : undefined,
      },
    });

    return NextResponse.json(lead, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead. Please try again." },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        linkedIn: body.linkedIn,
        notes: body.notes,
        tags: body.tags,
        stage: body.stage,
        nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : undefined,
      },
      include: { conversations: true },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await prisma.conversation.deleteMany({
      where: { leadId: id },
    });

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Lead and associated conversations deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
