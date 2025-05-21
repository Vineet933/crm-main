import React, { useState } from "react";
import { Lead, Conversation } from "../types";
import {
  Linkedin,
  GripVertical,
  MessageCircle,
  Phone,
  Mail,
  Plus,
} from "lucide-react";
import AddConversationModal from "./AddConversationModal";

interface LeadCardProps {
  lead: Lead;
  onAddConversation?: (
    leadId: string,
    conversation: {
      type: "email" | "call" | "linkedin" | "meeting" | "other";
      summary: string;
      outcome?: string;
      reminder?: string;
    }
  ) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onAddConversation,
}: LeadCardProps) => {
  const [showConversationModal, setShowConversationModal] = useState(false);

  console.log("Lead data:", lead);

  // Get the latest follow-up reminder from conversations
  const latestFollowUp = lead.conversations?.reduce(
    (latest: string | undefined, conv: Conversation) => {
      if (conv.reminder) {
        const reminderDate = new Date(conv.reminder);
        if (!latest || reminderDate > new Date(latest)) {
          return conv.reminder.toISOString();
        }
      }
      return latest;
    },
    undefined
  );

  const hasFollowUp = !!latestFollowUp;

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "linkedin":
        return <Linkedin className="h-3 w-3" />;
      default:
        return <MessageCircle className="h-3 w-3" />;
    }
  };

  const handleAddConversation = (conversation: {
    type: "email" | "call" | "linkedin" | "meeting" | "other";
    summary: string;
    outcome?: string;
    reminder?: string;
  }) => {
    onAddConversation?.(lead.id, conversation);
    setShowConversationModal(false);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm hover:shadow transition-shadow group">
      <div className="flex items-start p-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move mr-2 text-gray-400 hover:text-gray-600 pt-1">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 truncate">
                {lead.name}
              </h4>
              <p className="text-sm text-gray-500 truncate">{lead.company}</p>
            </div>

            {lead.linkedIn && (
              <a
                href={lead.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-1 truncate">{lead.email}</p>

          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full ${getTagColorClass(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">
                Conversations
              </span>
              <button
                onClick={() => setShowConversationModal(true)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {lead.conversations && lead.conversations.length > 0 ? (
              <div className="space-y-1">
                {lead.conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center text-xs text-gray-500 group/conversation relative"
                  >
                    {getConversationIcon(conversation.type)}
                    <span className="ml-1 truncate cursor-help">
                      {formatDate(conversation.timestamp)}:{" "}
                      {conversation.content}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/conversation:block z-10">
                      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
                        <p className="font-medium mb-1">
                          {formatDate(conversation.timestamp)}
                        </p>
                        <p className="mb-1">Type: {conversation.type}</p>
                        <p className="mb-1">Content: {conversation.content}</p>
                        {conversation.reminder && (
                          <div className="mt-2 pt-2 border-t border-gray-700">
                            <p className="font-medium">Follow-up Reminder</p>
                            <p className="text-sm">
                              {formatDate(conversation.reminder)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="absolute left-4 top-full -mt-2 border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                No conversations logged
              </p>
            )}

            <div className="mt-2">
              <span className="block text-xs font-semibold text-gray-800">
                Next Follow Up
              </span>
              <span className="block text-xs text-gray-700 mt-0.5">
                {hasFollowUp && latestFollowUp
                  ? formatDate(latestFollowUp)
                  : "-"}
              </span>
            </div>

            {lead.notes && (
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span className="truncate">{lead.notes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConversationModal && (
        <AddConversationModal
          leadId={lead.id}
          onClose={() => setShowConversationModal(false)}
          onAdd={handleAddConversation}
          initialSummary={lead.conversations?.[0]?.content || ""}
        />
      )}
    </div>
  );
};

const getTagColorClass = (tag: string): string => {
  const tagMap: Record<string, string> = {
    "High Value": "bg-purple-100 text-purple-800",
    "Follow Up": "bg-amber-100 text-amber-800",
    "New Lead": "bg-blue-100 text-blue-800",
    Meeting: "bg-green-100 text-green-800",
    Urgent: "bg-red-100 text-red-800",
    Enterprise: "bg-indigo-100 text-indigo-800",
    SMB: "bg-teal-100 text-teal-800",
  };

  return tagMap[tag] || "bg-gray-100 text-gray-800";
};

export default LeadCard;
