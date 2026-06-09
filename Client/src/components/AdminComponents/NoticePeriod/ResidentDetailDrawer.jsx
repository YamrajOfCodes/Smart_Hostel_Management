function ResidentDetailDrawer({ resident, onClose, onAction }) {
  const noticeState = getNoticeState(resident.noticePeriod);
  const days        = noticeState === "pending" ? getDaysUntilVacating(resident.noticePeriod) : null;
  const urgency     = days !== null ? getUrgencyConfig(days) : null;

  const detailFields = [
    { icon: ICONS.mail,        label: "Email",       value: resident.email,                                          bg: "bg-indigo-50"  },
    { icon: ICONS.phone,       label: "Phone",       value: resident.phone,                                          bg: "bg-cyan-50"    },
    { icon: ICONS.door,        label: "Room",        value: resident.roomNumber,                                     bg: "bg-amber-50"   },
    { icon: ICONS.joiningDate, label: "Joined",      value: formatDate(resident.joiningDate),                        bg: "bg-emerald-50" },
    { icon: ICONS.rupee,       label: "Deposit",     value: `₹${Number(resident.deposite).toLocaleString("en-IN")}`, bg: "bg-violet-50"  },
    { icon: ICONS.calendar,    label: "Vacating on", value: noticeState === "pending" ? resident.noticePeriod : "—", bg: "bg-red-50"     },
  ];

  return (
    <div
      className="fixed inset-0 bg-[#1A1714]/35 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#EAE7E2]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2EFE9]">
          <p className="text-sm font-semibold text-[#1A1714]">Resident details</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#F2EFE9] flex items-center justify-center hover:bg-[#EAE7E2] transition-colors cursor-pointer border-none"
          >
            <Icon paths={ICONS.x} size={13} stroke="#5A5248" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1714] text-white flex items-center justify-center text-base font-semibold shrink-0">
              {getInitials(resident.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-[#1A1714]">{resident.name}</p>
              <p className="text-xs text-[#B0A898] mt-0.5">Room {resident.roomNumber}</p>
            </div>
            {/* Show urgency pill for pending, state badge for others */}
            {urgency ? (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${urgency.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
                {urgency.label}
              </span>
            ) : (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATE_BADGE[noticeState] || ""}`}>
                {STATE_LABEL[noticeState] || ""}
              </span>
            )}
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {detailFields.map(({ icon, label, value, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon paths={icon} size={11} stroke="currentColor" className="opacity-60" />
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions — contextual based on notice state */}
          <div className="grid gap-2">
            {noticeState === "pending" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAction(resident, ACTION.ACCEPT)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Icon paths={ICONS.check} size={12} stroke="currentColor" />
                  Accept Notice
                </button>
                <button
                  onClick={() => onAction(resident, ACTION.REJECT)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Icon paths={ICONS.ban} size={12} stroke="currentColor" />
                  Reject Notice
                </button>
              </div>
            )}
            {noticeState === "approved" && (
              <button
                onClick={() => onAction(resident, ACTION.CLEAR)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F2EFE9] border border-[#DDD8D0] text-[#5A5248] text-xs font-semibold hover:bg-[#EAE7E2] transition-colors cursor-pointer"
              >
                <Icon paths={ICONS.check} size={12} stroke="currentColor" />
                Mark as Vacated
              </button>
            )}
            {noticeState === "rejected" && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-xs text-red-600 text-center">
                This notice has been rejected. Resident must resubmit.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResidentDetailDrawer;