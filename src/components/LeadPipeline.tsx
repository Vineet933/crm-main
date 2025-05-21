import React, { useState, useEffect } from "react";
import LeadFormModal from "./LeadFormModal";
import { useRouter } from "next/navigation";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { Linkedin } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [addStage, setAddStage] = useState<string | null>(null);
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

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setAddStage(null);
    fetchLeads();
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setAddStage(null);
  };

  const handleModalSuccess = () => {
    handleAddSuccess();
    setShowAddModal(false);
    setAddStage(null);
  };

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.key] = leads.filter((l) => l.stage === stage.key);
    return acc;
  }, {} as Record<string, any[]>);

  // Handle drag end
  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    // Optimistically update UI
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === draggableId
          ? { ...lead, stage: destination.droppableId }
          : lead
      )
    );

    // Persist change to DB
    try {
      await fetch(`/api/leads/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destination.droppableId }),
      });
      fetchLeads(); // Refresh to ensure consistency
    } catch (err) {
      alert("Failed to update lead stage");
      fetchLeads();
    }
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
          <NotificationDropdown leads={leads} />
          <ProfileDropdown />
        </div>
      </div>
      <LeadFormModal
        open={showAddModal || !!addStage}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        defaultStage={addStage}
      />
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Lead Pipeline</h2>
        {loading ? (
          <div>Loading leads...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
              {stages.map((stage) => (
                <Droppable droppableId={stage.key} key={stage.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-w-[320px] ${
                        stage.color
                      } rounded-lg p-4 ${
                        stage.border
                      } border transition-shadow ${
                        snapshot.isDraggingOver ? "shadow-lg" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg flex items-center">
                          {stage.label}
                          <span className="ml-2 bg-white px-2 py-1 rounded text-xs font-bold border">
                            {leadsByStage[stage.key]?.length || 0}
                          </span>
                        </span>
                        <button
                          className="ml-2 text-xl font-bold text-gray-400"
                          onClick={() => setAddStage(stage.key)}
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {leadsByStage[stage.key]?.map((lead, idx) => (
                          <Draggable
                            draggableId={lead.id}
                            index={idx}
                            key={lead.id}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg p-4 shadow border flex flex-col transition-shadow ${
                                  snapshot.isDragging
                                    ? "ring-2 ring-blue-400"
                                    : ""
                                }`}
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
                                  {lead.linkedIn && (
                                    <a
                                      href={lead.linkedIn}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                      title="View LinkedIn Profile"
                                    >
                                      <Linkedin className="h-5 w-5" />
                                    </a>
                                  )}
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
                                  <div className="font-semibold text-sm">
                                    Notes
                                  </div>
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
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
