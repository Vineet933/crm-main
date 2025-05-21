import React, { useState } from "react";
import { X, User, Mail, Building, Linkedin, LogOut } from "lucide-react";

// Hardcoded user data
const userData = {
  name: "John Smith",
  email: "john.smith@company.com",
  company: "SalesCRM Inc.",
  linkedIn: "https://linkedin.com/in/johnsmith",
  role: "Sales Manager",
};

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Add logout functionality here
    console.log("Logout clicked");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-300 hover:bg-blue-200 transition-colors"
        title="Profile"
      >
        {userData.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {userData.name}
                </h3>
                <p className="text-sm text-gray-500">{userData.role}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              <a
                href={`mailto:${userData.email}`}
                className="text-sm hover:text-blue-600"
              >
                {userData.email}
              </a>
            </div>

            <div className="flex items-center text-gray-700">
              <Building className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-sm">{userData.company}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Linkedin className="h-4 w-4 mr-3 text-gray-500" />
              <a
                href={userData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-blue-600"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
