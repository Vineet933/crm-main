import React, { useState } from "react";
import { X } from "lucide-react";

interface AddConversationModalProps {
  leadId: string;
  onClose: () => void;
  onAdd: (conversation: {
    type: "email" | "call" | "linkedin" | "meeting" | "other";
    summary: string;
    outcome?: string;
    reminder?: string;
  }) => void;
  initialSummary?: string;
}

const AddConversationModal: React.FC<AddConversationModalProps> = ({
  onClose,
  onAdd,
  initialSummary = "",
}) => {
  const [type, setType] = useState<
    "email" | "call" | "linkedin" | "meeting" | "other"
  >("call");
  const [summary, setSummary] = useState(initialSummary);
  const [outcome, setOutcome] = useState("");
  const [reminder, setReminder] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      summary,
      outcome: outcome || undefined,
      reminder: reminder
        ? (() => {
            const d = new Date(reminder);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
          })()
        : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Log Conversation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setType(
                    e.target.value as
                      | "email"
                      | "call"
                      | "linkedin"
                      | "meeting"
                      | "other"
                  )
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="linkedin">LinkedIn</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label
                htmlFor="outcome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Outcome (optional)
              </label>
              <input
                type="text"
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                placeholder="e.g., Scheduled follow-up, Sent proposal"
              />
            </div>

            <div>
              <label
                htmlFor="reminder"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Follow-up Reminder (optional)
              </label>
              <input
                type="datetime-local"
                id="reminder"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Log Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConversationModal;
