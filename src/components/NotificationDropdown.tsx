import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Lead } from "@/types";

interface NotificationDropdownProps {
  leads: Lead[];
}

interface Reminder {
  leadId: string;
  leadName: string;
  reminderDate: Date;
  type: string;
  content: string;
}

export default function NotificationDropdown({
  leads,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Process leads to extract reminders
    const upcomingReminders: Reminder[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    leads.forEach((lead) => {
      // Check conversations for reminders
      lead.conversations?.forEach((conv) => {
        if (conv.reminder) {
          const reminderDate = new Date(conv.reminder);
          if (reminderDate >= now && reminderDate <= thirtyDaysFromNow) {
            upcomingReminders.push({
              leadId: lead.id,
              leadName: lead.name,
              reminderDate: reminderDate,
              type: conv.type,
              content: conv.content,
            });
          }
        }
      });
    });

    // Sort reminders by date
    upcomingReminders.sort(
      (a, b) => a.reminderDate.getTime() - b.reminderDate.getTime()
    );
    setReminders(upcomingReminders);
    setHasUnread(upcomingReminders.length > 0);
  }, [leads]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {hasUnread && (
          <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Upcoming Reminders</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {reminders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {reminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {reminder.leadName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {reminder.content}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="capitalize">{reminder.type}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(reminder.reminderDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No upcoming reminders
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
