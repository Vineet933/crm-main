import React, { useState } from "react";

const stages = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LeadFormModal({
  open,
  onClose,
  onSuccess,
  defaultStage,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultStage?: string | null;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    linkedIn: "",
    notes: "",
    tags: "",
    stage: defaultStage || "NEW",
    nextFollowUp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (open && defaultStage) {
      setForm((prev) => ({ ...prev, stage: defaultStage }));
    }
  }, [defaultStage, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!isValidEmail(form.email)) return "Email is not valid.";
    if (!form.stage) return "Stage is required.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          linkedIn: form.linkedIn,
          notes: form.notes,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          stage: form.stage,
          nextFollowUp: form.nextFollowUp || null,
        }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          setError("Server returned invalid response format");
          setLoading(false);
          return;
        }
      }

      if (!response.ok) {
        setError(data?.error || `Server error: ${response.status}`);
        setLoading(false);
        return;
      }

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "Error adding lead. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative my-8 mx-4 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">LinkedIn</label>
            <input
              name="linkedIn"
              value={form.linkedIn}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold">Stage</label>
            {defaultStage ? (
              <input
                type="text"
                value={
                  stages.find((s) => s.value === form.stage)?.label ||
                  form.stage
                }
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            ) : (
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                {stages.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block font-semibold">Next Follow Up</label>
            <input
              name="nextFollowUp"
              type="date"
              value={form.nextFollowUp}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
