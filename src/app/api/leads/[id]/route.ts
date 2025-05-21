import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Stage } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/leads/[id] - Get a single lead
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { conversations: true },
  });
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json(lead);
}

// PUT /api/leads/[id] - Update a lead
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    
    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      company: data.company,
      linkedIn: data.linkedIn,
      notes: data.notes,
      tags: data.tags,
      stage: data.stage,
      nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
    };

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: updateData,
      include: { conversations: true },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
