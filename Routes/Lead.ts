import prisma from "../src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const stage = searchParams.get("stage");

  // Get single lead by ID
  if (id) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { conversations: true },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  }

  // Get leads with optional stage filter
  const whereClause = stage ? { stage: stage as any } : {};
  const leads = await prisma.lead.findMany({
    where: whereClause,
    include: { conversations: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.company) {
      return NextResponse.json(
        { error: "Name, email, and company are required fields" },
        { status: 400 }
      );
    }

    const newLead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        linkedIn: body.linkedIn || "",
        notes: body.notes || "",
        tags: body.tags || [],
        stage: body.stage ?? "NEW",
      },
      include: { conversations: true },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
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

    // Check if lead exists
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

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Delete all associated conversations first
    await prisma.conversation.deleteMany({
      where: { leadId: id },
    });

    // Then delete the lead
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
