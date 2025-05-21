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
  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      status: data.status as Stage,
      linkedin: data.linkedin,
      tags: data.tags,
      notes: data.notes,
      nextFollowUp: data.nextFollowUp,
    },
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
