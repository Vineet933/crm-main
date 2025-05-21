import React from "react";
import { X, Linkedin, Tag, Calendar, MessageSquare } from "lucide-react";
import { Lead } from "../types";

interface LeadDetailCardProps {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDetailCard({ lead, onClose }: LeadDetailCardProps) {
  // Get the latest follow-up date from conversations
  const latestFollowUp = lead.conversations?.reduce((latest, conv) => {
    if (
      conv.reminder &&
      (!latest || new Date(conv.reminder) > new Date(latest))
    ) {
      return conv.reminder;
    }
    return latest;
  }, undefined as string | undefined);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1">{lead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1">{lead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Company
                </label>
                <p className="mt-1">{lead.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Stage
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      lead.stage === "NEW"
                        ? "bg-blue-100 text-blue-800"
                        : lead.stage === "CONTACTED"
                        ? "bg-yellow-100 text-yellow-800"
                        : lead.stage === "CONVERTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {lead.stage}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          {lead.linkedIn && (
            <div>
              <h3 className="text-lg font-semibold mb-2">LinkedIn</h3>
              <a
                href={lead.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                View Profile
              </a>
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {latestFollowUp && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Next Follow-up</h3>
              <div className="inline-flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(latestFollowUp)}
              </div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Conversations */}
          {lead.conversations && lead.conversations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Recent Conversations
              </h3>
              <div className="space-y-3">
                {lead.conversations.slice(0, 5).map((conversation) => (
                  <div
                    key={conversation.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium capitalize">
                            {conversation.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(conversation.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">
                          {conversation.content}
                        </p>
                        {conversation.reminder && (
                          <div className="mt-2 text-sm text-gray-500">
                            Follow-up: {formatDate(conversation.reminder)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
