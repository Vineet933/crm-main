import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");

  if (leadId) {
    const conversations = await prisma.conversation.findMany({
      where: { leadId },
      orderBy: { timestamp: "desc" },
      include: { lead: true },
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
  try {
    const body = await req.json();

    if (!body.leadId || !body.type || !body.content) {
      return NextResponse.json(
        { error: "LeadId, type, and content are required fields" },
        { status: 400 }
      );
    }

    const newConversation = await prisma.conversation.create({
      data: {
        leadId: body.leadId,
        type: body.type,
        content: body.content,
        reminder: body.reminder ? new Date(body.reminder) : null,
      },
      include: { lead: true },
    });
    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
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
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const existingConversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

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
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
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
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
