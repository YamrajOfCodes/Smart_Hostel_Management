import { useState, useEffect } from "react";
import {
  Wrench,
  Droplets,
  Zap,
  ShieldCheck,
  Building2,
  ClipboardList,
  X,
  AlertCircle,
  Info,
} from "lucide-react";

const CATEGORIES = {
  maintenance: {
    label: "Maintenance",
    Icon: Wrench,
    description: "Repair work — lifts, plumbing, common areas.",
    defaultUrgency: "medium",
    placeholder: "e.g. Lift #2 out of service for annual maintenance on Monday 9am–5pm.",
    colors: {
      banner: "bg-amber-50 border-amber-200",
      icon: "text-amber-600",
      text: "text-amber-800",
      subtext: "text-amber-600",
    },
  },
  water: {
    label: "Water supply",
    Icon: Droplets,
    description: "Interruptions, tank cleaning, or quality advisories.",
    defaultUrgency: "high",
    placeholder: "e.g. Water supply interrupted Saturday 6am–2pm for tank cleaning.",
    colors: {
      banner: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
      subtext: "text-blue-600",
    },
  },
  electricity: {
    label: "Electricity",
    Icon: Zap,
    description: "Scheduled outages, DG timings, or meter inspections.",
    defaultUrgency: "high",
    placeholder: "e.g. Power shutdown 10am–1pm Sunday for transformer maintenance.",
    colors: {
      banner: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-600",
      text: "text-yellow-800",
      subtext: "text-yellow-600",
    },
  },
  security: {
    label: "Security",
    Icon: ShieldCheck,
    description: "Gate changes, visitor policies, or safety advisories.",
    defaultUrgency: "medium",
    placeholder: "e.g. Main gate on single-entry mode this weekend due to event.",
    colors: {
      banner: "bg-purple-50 border-purple-200",
      icon: "text-purple-600",
      text: "text-purple-800",
      subtext: "text-purple-600",
    },
  },
  amenities: {
    label: "Amenities",
    Icon: Building2,
    description: "Gym, pool, clubhouse, or parking area updates.",
    defaultUrgency: "normal",
    placeholder: "e.g. Swimming pool closed every Monday 8am–12pm for cleaning.",
    colors: {
      banner: "bg-teal-50 border-teal-200",
      icon: "text-teal-600",
      text: "text-teal-800",
      subtext: "text-teal-600",
    },
  },
  other: {
    label: "Other",
    Icon: ClipboardList,
    description: "Community announcements, events, or general updates.",
    defaultUrgency: "normal",
    placeholder: "e.g. AGM scheduled for 15th June at 7pm in the clubhouse.",
    colors: {
      banner: "bg-slate-50 border-slate-200",
      icon: "text-slate-500",
      text: "text-slate-700",
      subtext: "text-slate-500",
    },
  },
};

const URGENCY_OPTIONS = [
  { value: "normal", label: "Normal", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high",   label: "High",   color: "text-red-600"   },
];

export default function AddNoticeModal({ modal, onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    body: "",
    author: "",
    urgency: "normal",
    ...modal.data,
  });

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Auto-suggest urgency when category changes
  useEffect(() => {
    if (formData.category) {
      updateField("urgency", CATEGORIES[formData.category].defaultUrgency);
    }
  }, [formData.category]);

  const selectedCategory = CATEGORIES[formData.category] ?? null;
  const isValid = formData.category && formData.title.trim() && formData.body.trim();
  const isEditMode = modal.mode === "edit";

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            {isEditMode ? "Edit notice" : "Post notice"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const isSelected = formData.category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateField("category", key)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <cat.Icon
                      size={18}
                      className={isSelected ? "text-blue-600" : "text-slate-400"}
                    />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category banner */}
          {selectedCategory && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 ${selectedCategory.colors.banner}`}
            >
              <selectedCategory.Icon
                size={16}
                className={`mt-0.5 shrink-0 ${selectedCategory.colors.icon}`}
              />
              <p className={`text-xs leading-relaxed ${selectedCategory.colors.subtext}`}>
                {selectedCategory.description}
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder={
                selectedCategory?.placeholder?.split(".")[0] ??
                "e.g. Water supply interrupted Saturday"
              }
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-300"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Message *
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => updateField("body", e.target.value)}
              rows={3}
              placeholder={selectedCategory?.placeholder ?? "Write the notice details here…"}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Posted by + Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Posted by
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => updateField("author", e.target.value)}
                placeholder="Admin"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => updateField("urgency", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
              >
                {URGENCY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Urgency hint for high */}
          {formData.urgency === "high" && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <AlertCircle size={14} className="shrink-0" />
              High urgency notices will be highlighted and residents notified immediately.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(formData)}
            disabled={!isValid}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            {isEditMode ? "Save changes" : "Post notice"}
          </button>
        </div>

      </div>
    </div>
  );
}