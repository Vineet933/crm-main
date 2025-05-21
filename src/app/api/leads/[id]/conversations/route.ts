import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/leads/[leadId]/conversations - Add a conversation to a lead
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const conversation = await prisma.conversation.create({
    data: {
      leadId: params.id,
      type: data.type,
      date: data.date,
      summary: data.summary,
      outcome: data.outcome,
    },
  });
  return NextResponse.json(conversation, { status: 201 });
} 