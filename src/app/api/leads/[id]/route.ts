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
  const data = await req.json();
  const updateData: any = {};
  if (data.stage) updateData.stage = data.stage;
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.company) updateData.company = data.company;
  if (data.linkedIn) updateData.linkedIn = data.linkedIn;
  if (data.tags) updateData.tags = data.tags;
  if (data.notes) updateData.notes = data.notes;
  if (data.nextFollowUp) updateData.nextFollowUp = data.nextFollowUp;

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: updateData,
  });
  return NextResponse.json(lead);
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
