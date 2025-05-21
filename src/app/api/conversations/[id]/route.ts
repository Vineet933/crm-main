import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/conversations/[id] - Edit a conversation
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const conversation = await prisma.conversation.update({
    where: { id: params.id },
    data: {
      type: data.type,
      date: data.date,
      summary: data.summary,
      outcome: data.outcome,
    },
  });
  return NextResponse.json(conversation);
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.conversation.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
} 