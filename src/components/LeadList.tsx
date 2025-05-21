"use client";

import { useEffect, useState } from "react";
import { useLeads } from "../hooks/useLeads";
import { Stage } from "@prisma/client";

export function LeadList() {
  const [mounted, setMounted] = useState(false);
  const { leads, loading, error, fetchLeads, deleteLead, updateLead } =
    useLeads();

  useEffect(() => {
    setMounted(true);
    fetchLeads();
  }, [fetchLeads]);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  if (loading) return <div className="p-4">Loading leads...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleStatusChange = async (id: string, newStatus: Stage) => {
    try {
      await updateLead(id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
      } catch (err) {
        console.error("Failed to delete lead:", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">{lead.name}</h3>
          <p>{lead.email}</p>
          <p>{lead.company}</p>
          <div className="mt-2 space-x-2">
            <select
              value={lead.status}
              onChange={(e) =>
                handleStatusChange(lead.id, e.target.value as Stage)
              }
              className="border rounded px-2 py-1"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
            <button
              onClick={() => handleDelete(lead.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
