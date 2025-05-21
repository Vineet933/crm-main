import prisma from "../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");

  if (leadId) {
    const conversations = await prisma.conversation.findMany({
      where: { leadId },
      orderBy: { timestamp: "desc" },
    });
    return NextResponse.json(conversations);
  }

  const conversations = await prisma.conversation.findMany({
    orderBy: { timestamp: "desc" },
    include: { lead: true },
  });
  return NextResponse.json(conversations);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newConversation = await prisma.conversation.create({
    data: {
      leadId: body.leadId,
      type: body.type,
      content: body.content,
      reminder: body.reminder ? new Date(body.reminder) : null,
    },
    include: { lead: true },
  });
  return NextResponse.json(newConversation);
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const updatedConversation = await prisma.conversation.update({
    where: { id },
    data: {
      type: body.type,
      content: body.content,
      reminder: body.reminder ? new Date(body.reminder) : null,
    },
    include: { lead: true },
  });
  return NextResponse.json(updatedConversation);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  await prisma.conversation.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}
