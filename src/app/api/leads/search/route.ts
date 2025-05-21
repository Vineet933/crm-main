import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    console.log("Search API called with query:", query); // Debug log

    if (!query) {
      console.log("No query provided"); // Debug log
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Search leads where name or email starts with the query
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { name: { startsWith: query, mode: "insensitive" } },
          { email: { startsWith: query, mode: "insensitive" } },
        ],
      },
      include: {
        conversations: {
          orderBy: { timestamp: "desc" },
          take: 5,
        },
      },
      take: 3, // Limit to 3 results
      orderBy: [
        // First prioritize exact matches at the start
        { name: "asc" },
        { email: "asc" },
        // Then by creation date
        { createdAt: "desc" },
      ],
    });

    console.log("Found leads:", leads.length); // Debug log
    console.log("First lead:", leads[0]); // Debug log

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Search API error:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to search leads" },
      { status: 500 }
    );
  }
}
