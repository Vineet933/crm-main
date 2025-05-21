import React from "react";
import LeadCard from "./LeadCard";
import { Lead } from "../types";
import { Plus } from "lucide-react";

interface ColumnProps {
  title: string;
  color: string;
  leads: Lead[];
  onAddConversation?: (
    leadId: string,
    conversation: {
      type: "email" | "call" | "linkedin" | "meeting" | "other";
      summary: string;
      outcome?: string;
      reminder?: Date | null;
    }
  ) => void;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "amber":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "green":
      return "bg-green-100 text-green-800 border-green-300";
    case "red":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const Column: React.FC<ColumnProps> = ({
  title,
  color,
  leads,
  onAddConversation,
}) => {
  const colorClasses = getColorClasses(color);

  return (
    <div className="flex flex-col w-72 bg-gray-50 rounded-md border border-gray-200 flex-shrink-0 shadow-sm">
      <div
        className={`p-3 border-b border-gray-200 flex items-center justify-between ${colorClasses}`}
      >
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-white bg-opacity-50">
            {leads.length}
          </span>
        </div>
        <button className="p-1 rounded-md hover:bg-white hover:bg-opacity-30 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-13rem)] p-2">
        {leads.length > 0 ? (
          <div className="space-y-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAddConversation={onAddConversation}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4 text-gray-500 text-sm">
            <p>No leads in this stage</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Plus className="h-3 w-3 mr-1" /> Add lead
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
