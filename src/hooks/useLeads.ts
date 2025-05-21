import { useState, useCallback } from "react";
import { Lead } from "../types";
import { leadApi } from "../services/api";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadApi.getAll();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new lead
  const createLead = useCallback(
    async (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true);
        setError(null);
        const newLead = await leadApi.create(lead);
        setLeads((prev) => [...prev, newLead]);
        return newLead;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create lead");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update lead
  const updateLead = useCallback(
    async (id: string, updates: Partial<Lead>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedLead = await leadApi.update(id, updates);
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? updatedLead : lead))
        );
        return updatedLead;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update lead");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete lead
  const deleteLead = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await leadApi.delete(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
}
