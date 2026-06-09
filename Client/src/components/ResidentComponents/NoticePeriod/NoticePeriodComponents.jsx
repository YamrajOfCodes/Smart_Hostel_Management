/* ─────────────────────────────────────────────
   NoticePeriodBanners.jsx
   4 distinct banners for each notice period state.
   Used in PageNoticePeriod (resident dashboard).

   States:
   1. NoActiveNotice    — nothing submitted yet
   2. PendingBanner     — submitted, awaiting warden
   3. ApprovedBanner    — warden approved
   4. RejectedBanner    — warden rejected, can resubmit
───────────────────────────────────────────── */

import { useState } from "react";


/* ─── InfoTile ─── */
export const InfoTile = ({ iconPaths, iconStroke, bgColor, borderColor, labelColor, label, valueColor, value }) => (
  <div className={`${bgColor} ${borderColor} border rounded-2xl p-4 flex flex-col gap-2`}>
    <Icon paths={iconPaths} size={18} stroke={iconStroke} />
    <p className={`text-[10px] uppercase tracking-widest font-bold opacity-60 ${labelColor}`}>{label}</p>
    <p className={`text-sm font-bold ${valueColor}`}>{value}</p>
  </div>
);

/* ─── ProcessStep ─── */
export const ProcessStep = ({ step, isLast }) => (
  <div className="flex items-start gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-9 h-9 rounded-full ${step.accentColor} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}>
        {step.stepNumber}
      </div>
      {!isLast && <div className="w-px flex-1 bg-slate-100 mt-2 min-h-[24px]" />}
    </div>
    <div className={`${step.bgColor} ${step.borderColor} border rounded-xl p-3.5 flex-1 mb-4`}>
      <p className={`text-sm font-semibold ${step.textColor}`}>{step.title}</p>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
    </div>
  </div>
);

/* ── Icon helper ── */
const Icon = ({ paths, size = 18, strokeWidth = 1.75, fill = "none", stroke = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}>
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  shield:        "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:         ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
  calendar:      ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  checkCircle:   ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  xCircle:       ["M12 2a10 10 0 100 20 10 10 0 000-20z","M15 9l-6 6","M9 9l6 6"],
  alertTriangle: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  arrowRight:    "M5 12h14M12 5l7 7-7 7",
  arrowLeft:     "M19 12H5M12 5l-7 7 7 7",
  refresh:       ["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"],
  key:           ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"],
  home:          "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  info:          ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 16v-4","M12 8h.01"],
  check:         "M20 6L9 17l-5-5",
};

/* ────────────────────────────────────────────────────────────
   WITHDRAW MODAL  (shared by PendingBanner)
──────────────────────────────────────────────────────────── */
const WithdrawModal = ({ vacatingDate, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Icon paths={ICONS.xCircle} size={20} stroke="white" />
        </div>
        <div>
          <p className="font-bold text-white text-base">Withdraw Notice</p>
          <p className="text-red-100 text-xs mt-0.5">This cannot be undone</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Date chip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Icon paths={ICONS.calendar} size={16} stroke="#d97706" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">Planned Vacating Date</p>
            <p className="text-sm font-bold text-slate-800">{vacatingDate}</p>
          </div>
        </div>
        {/* Warning */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
          <Icon paths={ICONS.alertTriangle} size={15} stroke="#ef4444" className="mt-0.5 shrink-0" />
          <ul className="text-xs text-red-600 space-y-1.5 leading-relaxed">
            <li>· Your pending notice will be cancelled immediately.</li>
            <li>· You can re-submit a new notice at any time.</li>
            <li>· Contact your warden if you need assistance.</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onCancel} disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bg-white disabled:opacity-50">
          <Icon paths={ICONS.arrowLeft} size={13} />
          Keep Notice
        </button>
        <button onClick={onConfirm} disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold shadow-md hover:from-red-600 hover:to-rose-600 transition-all border-none cursor-pointer disabled:opacity-50">
          {isLoading
            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/><path d="M21 12a9 9 0 01-9 9"/></svg>
            : <Icon paths={ICONS.xCircle} size={13} stroke="white" />
          }
          {isLoading ? "Withdrawing…" : "Yes, Withdraw"}
        </button>
      </div>

    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────
   BANNER 1 — NO ACTIVE NOTICE
   Resident hasn't submitted anything yet.
──────────────────────────────────────────────────────────── */
export const NoActiveNotice = ({ onServeNotice }) => (
  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden">

    {/* Top strip */}
    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-slate-300" />
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Notice Period Status</p>
      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">INACTIVE</span>
    </div>

    <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
      {/* Icon block */}
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
        <Icon paths={ICONS.shield} size={36} stroke="#94a3b8" />
      </div>

      {/* Text */}
      <div className="text-center sm:text-left flex-1">
        <p className="font-bold text-lg text-slate-700">No Notice Submitted</p>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-sm">
          You have not submitted a vacating notice yet. A minimum of 30 days notice is required before your intended move-out date.
        </p>
        <button onClick={onServeNotice}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-teal-100 hover:from-teal-700 hover:to-teal-800 transition-all border-none cursor-pointer">
          <Icon paths={ICONS.arrowRight} size={14} stroke="white" />
          Serve Notice Period
        </button>
      </div>
    </div>

  </div>
);

/* ────────────────────────────────────────────────────────────
   BANNER 2 — PENDING
   Notice submitted, waiting for warden to act.
   Resident can withdraw while pending.
──────────────────────────────────────────────────────────── */
export const PendingNoticeBanner = ({ vacatingDate, onWithdrawSuccess }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing,       setIsWithdrawing]       = useState(false);

  /* Swap with your useWithdrawNoticePeriod hook */
  const handleWithdrawConfirm = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
      onWithdrawSuccess?.();
    }, 1000);
  };

  return (
    <>
      <div className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden">

        {/* Status strip */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Notice Period Status</p>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-700">PENDING APPROVAL</span>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <Icon paths={ICONS.clock} size={30} stroke="#d97706" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-bold text-base text-slate-800">Notice Submitted, Awaiting For Approval</p>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Your request has been sent to the warden for review. You will be notified once it is approved or rejected.
              </p>

              {/* Date pill */}
              <div className="flex items-center gap-2 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 w-fit">
                <Icon paths={ICONS.calendar} size={14} stroke="#d97706" />
                <div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Planned Vacating Date</p>
                  <p className="text-sm font-bold text-amber-800">{vacatingDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-amber-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Icon paths={ICONS.info} size={13} stroke="#94a3b8" />
              You can only withdraw while your notice is pending.
            </div>
            <button onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer shrink-0">
              <Icon paths={ICONS.xCircle} size={13} stroke="#dc2626" />
              Withdraw Notice
            </button>
          </div>
        </div>

      </div>

      {isWithdrawModalOpen && (
        <WithdrawModal
          vacatingDate={vacatingDate}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setIsWithdrawModalOpen(false)}
          isLoading={isWithdrawing}
        />
      )}
    </>
  );
};

/* ────────────────────────────────────────────────────────────
   BANNER 3 — APPROVED
   Warden approved. Resident prepares to vacate.
   Cannot withdraw — must contact warden.
──────────────────────────────────────────────────────────── */
export const ApprovedNoticeBanner = () => (
  <div className="bg-white border-2 border-emerald-300 rounded-2xl overflow-hidden">

    {/* Status strip */}
    <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Notice Period Status</p>
      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700">APPROVED</span>
    </div>

    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Icon paths={ICONS.checkCircle} size={30} stroke="#059669" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-bold text-base text-slate-800">Notice Approved by Warden</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Your vacating notice has been confirmed. Please complete all steps below before your move-out date.
          </p>

          {/* Checklist */}
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2.5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Before you leave</p>
            {[
              { label: "Return room keys to the warden office",      done: false },
              { label: "Ensure room is clean and cleared of belongings", done: false },
              { label: "Collect security deposit refund from admin", done: false },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? "bg-emerald-500 border-emerald-500" : "border-emerald-300"}`}>
                  {done && <Icon paths={ICONS.check} size={10} stroke="white" strokeWidth={3} />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-emerald-100">
        <Icon paths={ICONS.info} size={13} stroke="#94a3b8" />
        <p className="text-xs text-slate-400">
          To modify or cancel this notice, contact your warden directly.
        </p>
      </div>
    </div>

  </div>
);

/* ────────────────────────────────────────────────────────────
   BANNER 4 — REJECTED
   Warden rejected. Resident can resubmit.
──────────────────────────────────────────────────────────── */
export const RejectedNoticeBanner = ({ onResubmit }) => (
  <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden">

    {/* Status strip */}
    <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-red-500" />
      <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Notice Period Status</p>
      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-700">REJECTED</span>
    </div>

    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
          <Icon paths={ICONS.xCircle} size={30} stroke="#dc2626" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-bold text-base text-slate-800">Notice Rejected by Warden</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Your vacating notice was not approved. Please speak with your warden to understand the reason before submitting a new request.
          </p>

          {/* What to do next */}
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 space-y-2.5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">What to do next</p>
            {[
              "Contact your warden for the reason of rejection.",
              "Resolve any outstanding dues or issues.",
              "Submit a new notice with a revised date.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-red-100 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Icon paths={ICONS.home} size={13} stroke="#94a3b8" />
          Your room assignment remains unchanged.
        </div>
        <button onClick={onResubmit}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-100 hover:from-teal-700 hover:to-teal-800 transition-all border-none cursor-pointer">
          <Icon paths={ICONS.refresh} size={13} stroke="white" />
          Resubmit Notice
        </button>
      </div>
    </div>

  </div>
);