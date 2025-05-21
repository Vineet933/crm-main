import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.conversation.deleteMany();
    await prisma.lead.deleteMany();

    // Create leads first
    console.log("Creating leads...");
    await prisma.lead.createMany({
      data: [
        {
          name: "John Smith",
          email: "john@techcorp.com",
          company: "TechCorp",
          linkedIn: "https://linkedin.com/in/johnsmith",
          notes: "High value lead from SaaS conference.",
          tags: ["High Value", "Enterprise"],
          stage: "NEW",
        },
        {
          name: "Sarah Johnson",
          email: "sarah@innovate.io",
          company: "Innovate IO",
          linkedIn: "https://linkedin.com/in/sarahjohnson",
          notes: "",
          tags: ["New Lead", "SMB"],
          stage: "NEW",
        },
        {
          name: "Michael Wong",
          email: "michael@datastacks.com",
          company: "DataStacks",
          linkedIn: "https://linkedin.com/in/michaelwong",
          notes: "Follow up next week.",
          tags: ["Follow Up", "Enterprise"],
          stage: "CONTACTED",
        },
        {
          name: "Emily Chen",
          email: "emily@growthmarketing.com",
          company: "Growth Marketing",
          linkedIn: "https://linkedin.com/in/emilychen",
          notes: "Interested in meeting.",
          tags: ["Meeting", "High Value"],
          stage: "CONTACTED",
        },
        {
          name: "Lisa Rodriguez",
          email: "lisa@cloudify.co",
          company: "Cloudify",
          linkedIn: "https://linkedin.com/in/lisarodriguez",
          notes: "Contract signed.",
          tags: ["Enterprise"],
          stage: "CONVERTED",
        },
        {
          name: "James Wilson",
          email: "james@nextstep.io",
          company: "NextStep",
          linkedIn: "https://linkedin.com/in/jameswilson",
          notes: "",
          tags: ["SMB"],
          stage: "CONVERTED",
        },
        {
          name: "Alex Tanner",
          email: "alex@digitaledge.com",
          company: "Digital Edge",
          linkedIn: "https://linkedin.com/in/alextanner",
          notes: "Budget constraints, may revisit next quarter.",
          tags: ["SMB"],
          stage: "LOST",
        },
        {
          name: "Robert Lee",
          email: "robert@futuretechnologies.com",
          company: "Future Technologies",
          linkedIn: "https://linkedin.com/in/robertlee",
          notes: "",
          tags: ["Enterprise"],
          stage: "LOST",
        },
      ],
    });

    // Get all created leads
    console.log("Fetching created leads...");
    const createdLeads = await prisma.lead.findMany();
    console.log(`Found ${createdLeads.length} leads`);

    // Create follow-up conversations for each lead
    const followUpDates = [
      "2025-03-20",
      "2025-03-22",
      "2025-03-25",
      "2025-03-28",
      "2025-04-01",
      "2025-04-05",
      "2025-04-10",
      "2025-04-12",
    ];

    console.log("Creating follow-up conversations...");
    for (let i = 0; i < createdLeads.length; i++) {
      const conversation = await prisma.conversation.create({
        data: {
          leadId: createdLeads[i].id,
          type: "follow-up",
          content: `Follow-up scheduled for ${createdLeads[i].name}`,
          reminder: new Date(followUpDates[i]),
        },
      });
      console.log(
        `Created conversation for ${createdLeads[i].name} with reminder: ${conversation.reminder}`
      );
    }

    // Verify the data was inserted
    const conversations = await prisma.conversation.findMany({
      include: { lead: true },
    });
    console.log(`Total conversations created: ${conversations.length}`);
    console.log(
      "Sample conversation:",
      JSON.stringify(conversations[0], null, 2)
    );

    console.log("Dummy leads and follow-ups inserted successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
