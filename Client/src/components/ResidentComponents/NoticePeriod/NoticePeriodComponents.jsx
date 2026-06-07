import { useState } from "react";

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
  alertCircle:  ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 8v4", "M12 16h.01"],
  alertTriangle:["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  calendar:     ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  xCircle:      ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M15 9l-6 6", "M9 9l6 6"],
  arrowLeft:    "M19 12H5M12 5l-7 7 7 7",
  close:        ["M18 6L6 18","M6 6l12 12"],
  shield:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check:        "M20 6L9 17l-5-5",
};


 
 export const ProcessStep = ({ step, isLast }) => (
  <div className="flex items-start gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-9 h-9 rounded-full ${step.accentColor} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}>
        {step.stepNumber}
      </div>
      {!isLast && <div className="w-px flex-1 bg-slate-100 mt-2 mb-0 min-h-[24px]" />}
    </div>
    <div className={`${step.bgColor} ${step.borderColor} border rounded-xl p-3.5 flex-1 mb-4`}>
      <p className={`text-sm font-semibold ${step.textColor}`}>{step.title}</p>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
    </div>
  </div>
);



export const InfoTile = ({ iconPaths, iconStroke, bgColor, borderColor, labelColor, label, valueColor, value }) => (
  <div className={`${bgColor} ${borderColor} border rounded-2xl p-4 flex flex-col gap-2`}>
    <Icon paths={iconPaths} size={18} stroke={iconStroke} />
    <p className={`text-[10px] uppercase tracking-widest font-bold opacity-60 ${labelColor}`}>{label}</p>
    <p className={`text-sm font-bold ${valueColor}`}>{value}</p>
  </div>
);

import { useWithdrawNoticePeriod } from "../../../hooks/UserHooks/noticePeriodHooks"; // adjust path
import { jwtDecode } from "jwt-decode";
import WithdrawConfirmModal from "../../Models/Resident/NoticePeriodModals/WithdrawConfirmModal";

/* ─────────────────────────────────────────────
   Inline SVG icon helper (matches existing codebase)
───────────────────────────────────────────── */
const Icons = ({ paths, size = 18, strokeWidth = 1.75, fill = "none", stroke = "currentColor", className = "" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}
  >
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);


export const ActiveNoticeBanner = ({ vacatingDate, onWithdrawSuccess }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const login       = localStorage.getItem("login");
  const decodedToken = jwtDecode(login);

  const { mutate: withdrawNotice, isPending: isWithdrawing } = useWithdrawNoticePeriod();

  const handleWithdrawConfirm = () => {
    const payload = {
      email:    decodedToken.email,
      hostelId: decodedToken.hostelId,
    };

    withdrawNotice(payload, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
        onWithdrawSuccess?.(); // notify parent to clear noticePeriod state
      },
    });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-center shadow-sm">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Icons paths={ICONS.alertCircle} size={28} stroke="#d97706" />
        </div>

        {/* Status text */}
        <p className="font-bold text-lg text-amber-800">Notice Period Active</p>
        <p className="text-sm text-amber-600 mt-1">Your vacating date is confirmed for</p>

        {/* Date chip */}
        <div className="inline-block bg-white border border-amber-200 rounded-xl px-5 py-3 mt-3 shadow-sm">
          <div className="flex items-center gap-2 justify-center">
            <Icons paths={ICONS.calendar} size={14} stroke="#d97706" />
            <p className="font-bold text-xl text-amber-700">{vacatingDate}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-200 mt-5 mb-4 mx-4" />

        {/* Info note + withdraw button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <p className="text-xs text-slate-400 text-left leading-relaxed max-w-[200px]">
            To modify this date, contact your warden directly.
          </p>
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer shrink-0"
          >
            <Icon paths={ICONS.xCircle} size={13} stroke="#dc2626" />
            Withdraw Notice
          </button>
        </div>

      </div>

      {/* Confirmation modal */}
      {isConfirmModalOpen && (
        <WithdrawConfirmModal
          vacatingDate={vacatingDate}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setIsConfirmModalOpen(false)}
          isLoading={isWithdrawing}
        />
      )}
    </>
  );
};

export default ActiveNoticeBanner;

export const NoActiveNotice = ({ onServeNotice }) => (
  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
      <Icon paths={ICONS.shield} size={28} stroke="#94a3b8" />
    </div>
    <p className="font-bold text-base text-slate-700">No Active Notice Period</p>
    <p className="text-sm text-slate-400 mt-1 mb-6 max-w-xs mx-auto leading-relaxed">
      Planning to vacate? Submit a notice at least {RESIDENT.noticeDays} days before your intended date.
    </p>
    <button
      onClick={onServeNotice}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-amber-100 hover:from-amber-600 hover:to-orange-600 transition-all border-none cursor-pointer"
    >
      <Icon paths={ICONS.arrowRight} size={14} stroke="white" />
      Serve Notice Period
    </button>
  </div>
);