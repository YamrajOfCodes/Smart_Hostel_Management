const getNoticeState = (noticePeriod) => {
  if (!noticePeriod)               return "none";
  if (noticePeriod === "approved") return "approved";
  if (noticePeriod === "rejected") return "rejected";
  return "pending";
};




const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const STATE_BADGE = {
  pending:  "bg-amber-50  text-amber-700  border border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50    text-red-700    border border-red-200",
};
 
const STATE_LABEL = {
  pending:  "Pending",
  approved: "Approved",
  rejected: "Rejected",
};
 
/* ─── Action config ───────────────────────────────────────────────────────── */
const ACTION = { ACCEPT: "accept", REJECT: "reject", CLEAR: "clear" };
 

const Icon = ({ paths, size = 16, strokeWidth = 1.75, fill = "none", stroke = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={`shrink-0 block ${className}`}>
    {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
 
const ICONS = {
  shield:        "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  calendar:      ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  phone:         ["M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"],
  door:          ["M3 3h18v18H3z","M9 3v18"],
  rupee:         ["M6 3h12","M6 8h12","M6 13h8a4 4 0 000-8","M6 21l7-8"],
  clock:         ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"],
  search:        ["M11 17a6 6 0 100-12 6 6 0 000 12z","M21 21l-4.35-4.35"],
  check:         ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  x:             ["M18 6L6 18","M6 6l12 12"],
  alertTriangle: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  download:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  inbox:         ["M22 12h-6l-2 3H10l-2-3H2","M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"],
  mail:          ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  joiningDate:   ["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"],
  ban:           ["M12 2a10 10 0 100 20 10 10 0 000-20z","M4.93 4.93l14.14 14.14"],
};
 
const getDaysUntilVacating = (noticePeriodStr) => {
  const diff = new Date(noticePeriodStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
const getUrgencyConfig = (days) => {
  if (days <= 7)  return { label: `${days}d left`, dot: "bg-red-500",     pill: "bg-red-50   text-red-700   border border-red-200"    };
  if (days <= 14) return { label: `${days}d left`, dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-700 border border-amber-200"  };
  return              { label: `${days}d left`, dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
};

function ResidentCard({ resident, onViewDetails, onAction }) {
  const noticeState = getNoticeState(resident.noticePeriod);
  const days        = noticeState === "pending" ? getDaysUntilVacating(resident.noticePeriod) : null;
  const urgency     = days !== null ? getUrgencyConfig(days) : null;

  return (
    <div className="bg-white border border-[#EAE7E2] rounded-xl p-4 hover:border-[#D0C8BE] hover:shadow-sm transition-all">

      {/* Top row — click opens drawer */}
      <div onClick={() => onViewDetails(resident)} className="flex items-start gap-3 mb-3.5 cursor-pointer">
        <div className="w-9 h-9 rounded-lg bg-[#1A1714] text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {getInitials(resident.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1714] truncate">{resident.name}</p>
          <p className="text-xs text-[#B0A898] truncate">{resident.email}</p>
        </div>
        {/* Urgency for pending, state badge for others */}
        {urgency ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${urgency.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
            {urgency.label}
          </span>
        ) : (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATE_BADGE[noticeState] || ""}`}>
            {STATE_LABEL[noticeState] || ""}
          </span>
        )}
      </div>

      {/* Meta — click opens drawer */}
      <div onClick={() => onViewDetails(resident)} className="flex items-center gap-4 pb-3.5 border-b border-[#F2EFE9] mb-3 cursor-pointer">
        <span className="text-xs text-[#9B9086]">
          <span className="block text-[#1A1714] font-medium text-[13px]">{resident.roomNumber}</span>
          Room
        </span>
        <span className="text-xs text-[#9B9086]">
          <span className="block text-[#1A1714] font-medium text-[13px]">
            {noticeState === "pending" ? resident.noticePeriod : STATE_LABEL[noticeState]}
          </span>
          Vacating
        </span>
        <span className="text-xs text-[#9B9086]">
          <span className="block text-[#1A1714] font-medium text-[13px]">
            ₹{Number(resident.deposite).toLocaleString("en-IN")}
          </span>
          Deposit
        </span>
      </div>

      {/* Action buttons — contextual */}
      {noticeState === "pending" && (
        <div className="flex gap-1.5">
          <button
            onClick={() => onAction(resident, ACTION.ACCEPT)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Icon paths={ICONS.check} size={11} stroke="currentColor" />
            Accept
          </button>
          <button
            onClick={() => onAction(resident, ACTION.REJECT)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Icon paths={ICONS.ban} size={11} stroke="currentColor" />
            Reject
          </button>
        </div>
      )}
      {noticeState === "approved" && (
        <button
          onClick={() => onAction(resident, ACTION.CLEAR)}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#F2EFE9] border border-[#DDD8D0] text-[#5A5248] text-[11px] font-semibold hover:bg-[#EAE7E2] transition-colors cursor-pointer"
        >
          <Icon paths={ICONS.check} size={11} stroke="currentColor" />
          Mark as Vacated
        </button>
      )}
      {noticeState === "rejected" && (
        <div className="text-center text-[11px] text-[#B0A898] py-1">
          Rejected — awaiting resubmission
        </div>
      )}

    </div>
  );
}

export default ResidentCard;