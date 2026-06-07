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
  alertCircle:  ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 8v4", "M12 16h.01"],
  alertTriangle:["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  calendar:     ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  xCircle:      ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M15 9l-6 6", "M9 9l6 6"],
  arrowLeft:    "M19 12H5M12 5l-7 7 7 7",
  close:        ["M18 6L6 18","M6 6l12 12"],
  shield:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check:        "M20 6L9 17l-5-5",
};


const WithdrawConfirmModal = ({ vacatingDate, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Icon paths={ICONS.xCircle} size={20} stroke="white" />
        </div>
        <div>
          <p className="font-bold text-white text-base leading-tight">Withdraw Notice Period</p>
          <p className="text-red-100 text-xs mt-0.5">This action cannot be undone</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Icon paths={ICONS.calendar} size={16} stroke="#d97706" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Planned Vacating Date</p>
            <p className="text-sm font-bold text-slate-800">{vacatingDate}</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
          <Icon paths={ICONS.alertTriangle} size={16} stroke="#ef4444" className="mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-red-700">Are you sure you want to withdraw?</p>
            <ul className="text-xs text-red-600 space-y-1 leading-relaxed list-none">
              <li>· Your notice period will be cancelled immediately.</li>
              <li>· You will need to re-submit if you plan to vacate later.</li>
              <li>· Contact your warden if you need assistance.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bg-white disabled:opacity-50"
        >
          <Icon paths={ICONS.arrowLeft} size={13} stroke="currentColor" />
          Keep Notice
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-100 hover:from-red-600 hover:to-rose-600 transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 01-9 9" />
            </svg>
          ) : (
            <Icon paths={ICONS.xCircle} size={13} stroke="white" />
          )}
          {isLoading ? "Withdrawing…" : "Yes, Withdraw"}
        </button>
      </div>

    </div>
  </div>
);

export default WithdrawConfirmModal;