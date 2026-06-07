import { useState } from "react";

const NoticeSubmitModal = ({ onClose, onSubmit }) => {

    const RESIDENT = {
  name:          "Arjun Mehta",
  room:          "A-204",
  hostel:        "Sunrise Boys Hostel",
  joinedDate:    "12 Jan 2024",
  depositAmount: "₹17,000",
  noticeDays:    30,
};


const Icon = ({ paths, size = 18, strokeWidth = 1.75, fill = "none", stroke = "currentColor", className = "" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}
  >
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:     ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
  calendar:  ["M3 9h18", "M16 3v4", "M8 3v4", "M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  rupee:     ["M6 3h12", "M6 8h12", "M6 13h8a4 4 0 000-8", "M6 21l7-8"],
  checkCircle: ["M22 11.08V12a10 10 0 11-5.93-9.14", "M22 4L12 14.01l-3-3"],
  alertCircle: ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 8v4", "M12 16h.01"],
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  info:      ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 16v-4", "M12 8h.01"],
  search:    ["M3 7a4 4 0 018 0c0 3-2 5-4 7H3V7z", "M10.5 17H21"],
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
};


  const [selectedDate, setSelectedDate] = useState("");

  const today = new Date();
  const minVacatingDate = new Date(today);
  minVacatingDate.setDate(today.getDate() + RESIDENT.noticeDays);
  const minDateString = minVacatingDate.toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!selectedDate) return;
    onSubmit(selectedDate);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e)=>{e.stopPropagation()}}>

        {/* Modal header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon paths={ICONS.calendar} size={18} stroke="white" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Serve Notice Period</p>
              <p className="text-amber-100 text-xs mt-0.5">{RESIDENT.hostel} · Room {RESIDENT.room}</p>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5">

          {/* Notice requirement callout */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <Icon paths={ICONS.info} size={16} stroke="#3b82f6" className="mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              A minimum of <strong>{RESIDENT.noticeDays} days</strong> notice is required before vacating.
              Your earliest possible vacating date is <strong>{minVacatingDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.
            </p>
          </div>

          {/* Resident summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your Details</p>
            {[
              { label: "Resident",   value: RESIDENT.name },
              { label: "Room",       value: `Room ${RESIDENT.room}` },
              { label: "Joined",     value: RESIDENT.joinedDate },
              { label: "Deposit",    value: RESIDENT.depositAmount },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-xs font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Planned Vacating Date
            </label>
            <input
              type="date"
              min={minDateString}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-white"
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedDate}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-md shadow-amber-100 hover:from-amber-600 hover:to-orange-600 transition-all border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Notice
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoticeSubmitModal;