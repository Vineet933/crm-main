"use client";

import React, { useEffect, useState } from "react";
import LeadSearch from "@/components/LeadSearch";
import LeadDetailCard from "@/components/LeadDetailCard";
import { Lead } from "@/types";
import { Stage } from "@prisma/client";

interface EditFormData {
  name: string;
  email: string;
  company: string;
  linkedIn: string;
  notes: string;
  tags: string[];
  stage: Stage;
}

export default function ManageLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    email: "",
    company: "",
    linkedIn: "",
    notes: "",
    tags: [],
    stage: "NEW",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (err: any) {
      setError("Failed to fetch leads");
    }
    setLoading(false);
  }

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
  };

  function handleEdit(lead: Lead) {
    setEditLead(lead);
    setEditForm({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      linkedIn: lead.linkedIn,
      notes: lead.notes || "",
      tags: lead.tags,
      stage: lead.stage,
    });
    setEditError("");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/leads/${editLead!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update lead");
        setEditLoading(false);
        return;
      }
      setEditLead(null);
      fetchLeads();
    } catch (err: any) {
      setEditError("Failed to update lead");
    }
    setEditLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      fetchLeads();
    } catch {
      alert("Failed to delete lead");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Manage Leads</h1>
        <div className="flex justify-center">
          <LeadSearch onLeadSelect={handleLeadSelect} />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1" onClick={() => handleLeadSelect(lead)}>
                  <h3 className="font-semibold">{lead.name}</h3>
                  <p className="text-gray-600">{lead.email}</p>
                  <p className="text-gray-500">{lead.company}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      lead.stage === 'NEW' ? 'bg-blue-100 text-blue-800' :
                      lead.stage === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                      lead.stage === 'CONVERTED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.stage}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(lead);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                    title="Edit lead"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(lead.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Delete lead"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Detail Card */}
      {selectedLead && (
        <LeadDetailCard
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Edit Modal */}
      {editLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setEditLead(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Lead</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold">Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">Company</label>
                <input
                  name="company"
                  value={editForm.company}
                  onChange={(e) =>
                    setEditForm({ ...editForm, company: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">LinkedIn</label>
                <input
                  name="linkedIn"
                  value={editForm.linkedIn}
                  onChange={(e) =>
                    setEditForm({ ...editForm, linkedIn: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">Notes</label>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">Tags (comma separated)</label>
                <input
                  name="tags"
                  value={editForm.tags.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tags: e.target.value.split(",").map((t) => t.trim())
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold">Stage</label>
                <select
                  name="stage"
                  value={editForm.stage}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stage: e.target.value as Stage })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
