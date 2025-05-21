import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Lead } from "../types";

interface LeadSearchProps {
  onLeadSelect: (lead: Lead) => void;
}

export default function LeadSearch({ onLeadSelect }: LeadSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLeads = async () => {
      console.log('Search query:', query);

      if (!query.trim()) {
        console.log('Empty query, clearing suggestions');
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching from API...');
        const response = await fetch(
          `/api/leads/search?q=${encodeURIComponent(query.trim())}`
        );
        console.log('API Response status:', response.status);
        
        if (!response.ok) throw new Error("Search failed");
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLeads, 150);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (lead: Lead) => {
    console.log('Selected lead:', lead);
    setQuery(lead.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLeadSelect(lead);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Input changed:', value);
    setQuery(value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  console.log('Current state:', {
    query,
    suggestionsCount: suggestions.length,
    isLoading,
    showSuggestions
  });

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder="Type to search leads..."
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSuggestions && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Searching...</div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((lead) => (
                <li
                  key={lead.id}
                  onClick={() => handleSelect(lead)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-sm text-gray-600">{lead.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No leads found starting with "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
