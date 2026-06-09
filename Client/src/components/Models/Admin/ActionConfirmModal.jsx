import { ACTION_CONFIG, getInitials,ACTION,formatDate,getDaysUntilVacating,getUrgencyConfig } from "../../../helpers/Admin/NoticePeriod/noticePeriod";


 

function ActionConfirmModal({ resident, action, onConfirm, onCancel, isLoading }) {
  const config = ACTION_CONFIG[action];

  return (
    <div
      className="fixed inset-0 bg-[#1A1714]/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden border border-[#EAE7E2] shadow-2xl">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#F2EFE9]">
          <p className={`text-[10px] font-bold tracking-[0.1em] uppercase mb-1 ${config.headerClass}`}>
            {config.label}
          </p>
          <p className="text-[20px] font-semibold text-[#1A1714]"
            style={{ fontFamily: "'Georgia', serif" }}>
            {config.title}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Resident summary */}
          <div className="flex items-center gap-3 bg-[#F9F8F6] border border-[#EAE7E2] rounded-xl p-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#1A1714] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {getInitials(resident.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1714]">{resident.name}</p>
              <p className="text-xs text-[#B0A898]">
                Room {resident.roomNumber} · {resident.noticePeriod}
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-amber-700 mb-2.5">
              Confirm before proceeding
            </p>
            <ul className="space-y-1.5">
              {config.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="mt-0.5 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg border border-[#EAE7E2] text-sm font-semibold text-[#5A5248] bg-white hover:bg-[#F9F8F6] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmClass}`}
          >
            {isLoading
              ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/><path d="M21 12a9 9 0 01-9 9"/></svg>
              : null
            }
            {isLoading ? "Processing…" : config.confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ActionConfirmModal;