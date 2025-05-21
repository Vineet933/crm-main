import React, { useState, useEffect } from "react";
import LeadFormModal from "./LeadFormModal";
import { useRouter } from "next/navigation";

const stages = [
  { key: "NEW", label: "New", color: "bg-blue-100", border: "border-blue-200" },
  {
    key: "CONTACTED",
    label: "Contacted",
    color: "bg-yellow-100",
    border: "border-yellow-200",
  },
  {
    key: "CONVERTED",
    label: "Converted",
    color: "bg-green-100",
    border: "border-green-200",
  },
  { key: "LOST", label: "Lost", color: "bg-red-100", border: "border-red-200" },
];

export default function LeadPipeline() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError("Failed to load leads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Refresh leads after adding
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-700">
            {" "}
            <span role="img" aria-label="crm">
              👤
            </span>{" "}
            SalesCRM
          </span>
        </div>
        <input
          type="text"
          placeholder="Search leads by name or email..."
          className="w-96 px-4 py-2 border rounded focus:outline-none focus:ring"
        />
        <div className="flex gap-2 items-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            onClick={() => setShowAddModal(true)}
          >
            + Add Lead
          </button>
          <button
            className="bg-white border px-4 py-2 rounded font-semibold"
            onClick={() => router.push("/manage-leads")}
          >
            Manage Leads
          </button>
          {/* Notification Bell Icon with Red Dot */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              title="Notifications"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          {/* Profile Avatar with Initials */}
          <div
            className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg ml-2 border border-blue-300"
            title="Profile"
          >
            JS
          </div>
        </div>
      </div>
      <LeadFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Lead Pipeline</h2>
        {loading ? (
          <div>Loading leads...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {stages.map((stage) => {
              const stageLeads = leads.filter((l) => l.stage === stage.key);
              return (
                <div
                  key={stage.key}
                  className={`flex-1 min-w-[320px] ${stage.color} rounded-lg p-4 ${stage.border} border`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">{stage.label}</span>
                    <span className="bg-white px-2 py-1 rounded text-xs font-bold border">
                      {stageLeads.length}
                    </span>
                    <button className="ml-2 text-xl font-bold text-gray-400">
                      +
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-lg p-4 shadow border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-md">
                              {lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.company}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                          </div>
                          <span
                            className="text-blue-700 text-xl cursor-pointer"
                            title="LinkedIn"
                          >
                            <a
                              href={lead.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                              </svg>
                            </a>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {lead.tags &&
                            lead.tags.map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-200"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="mt-2">
                          <div className="font-semibold text-sm">Notes</div>
                          <div className="text-xs text-gray-600 mb-1">
                            {lead.notes || "No notes"}
                          </div>
                          <div className="font-semibold text-sm">
                            Next Follow Up
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {lead.nextFollowUp || "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
