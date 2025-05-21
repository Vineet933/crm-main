"use client";

import LeadPipeline from "@/components/LeadPipeline";

// Dynamically import LeadList with no SSR
// const LeadList = dynamic(
//   () =>
//     import("@/components/LeadList").then((mod) => ({
//       default: mod.LeadList,
//     })),
//   {
//     ssr: false,
//     loading: () => <div className="p-4">Loading...</div>,
//   }
// );

export default function Home() {
  return <LeadPipeline />;
}
