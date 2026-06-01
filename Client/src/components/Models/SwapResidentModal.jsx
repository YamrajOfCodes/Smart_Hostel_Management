import { useState, useMemo } from "react";
import { ArrowLeftRight, X, ArrowUpDown } from "lucide-react";

/**
 * SwapResidentModal
 *
 * Props:
 *   member       – the resident to swap (shape: { tenantId: { _id, name }, bed })
 *   allRooms     – array of all room objects (to pick swap targets from)
 *   currentRoom  – the room object the member currently belongs to
 *   onClose      – () => void
 *   onConfirm    – ({ member, targetMember, targetRoom }) => void
 */
function SwapResidentModal({ member, allRooms = [], currentRoom, onClose, onConfirm }) {
  const [selectedResidentId, setSelectedResidentId] = useState("");

  const myName = member?.name || "Resident";
  const myRoom = currentRoom?.roomNumber || "—";

  // Flatten all residents from all rooms except current member
  const residentOptions = useMemo(() => {
    const opts = [];
    allRooms.forEach((room) => {
      if (room._id === currentRoom?._id) return; // skip same room
      (room.roomMembers || []).forEach((m) => {
        if (!m?._id) return;
        opts.push({
          id: m._id,
          name: m.name || "Unknown",
          roomNumber: room.roomNumber,
          roomId: room._id,
          member: m,
          room,
        });
      });
    });
    return opts;
  }, [allRooms, currentRoom]);

  const selected = residentOptions.find((o) => o.id === selectedResidentId);

  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleConfirm = () => {
      const payload = {
          member,
          targetMember: selected.member,
          targetRoom: selected.room,
        }

    if (!selected) return;
    onConfirm(payload);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <ArrowLeftRight size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-[14px]">Swap resident</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {myName} · Room {myRoom}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Current resident */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Current resident
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[11px] font-bold text-amber-700 flex-shrink-0">
                {initials(myName)}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">{myName}</p>
                <p className="text-[10px] text-slate-400">Room {myRoom}</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <div className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center">
              <ArrowUpDown size={12} className="text-slate-400" />
            </div>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Select target */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Swap with
            </p>
            {residentOptions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">
                No other residents available to swap.
              </p>
            ) : (
              <div className="relative">
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-800 bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
                >
                  <option value="">Select a resident…</option>
                  {residentOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} · Room {o.roomNumber}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            )}
          </div>

          {/* Preview */}
          {selected && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2.5">
                Swap preview
              </p>
              <div className="flex items-center gap-2">
                {/* From */}
                <div className="flex-1 bg-white rounded-lg border border-amber-100 px-2.5 py-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 mb-1">
                    {initials(myName)}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-800 leading-tight">{myName}</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">→ Room {selected.roomNumber}</p>
                </div>

                <ArrowLeftRight size={13} className="text-amber-400 flex-shrink-0" />

                {/* To */}
                <div className="flex-1 bg-white rounded-lg border border-amber-100 px-2.5 py-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 mb-1">
                    {initials(selected.name)}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-800 leading-tight">{selected.name}</p>
                  <p className="text-[10px] text-blue-600 mt-0.5">→ Room {myRoom}</p>
                </div>
              </div>
              <p className="text-[10px] text-amber-600/70 mt-2.5 leading-relaxed">
                Both residents will be moved to each other's beds. Billing stays unchanged.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all"
          >
            <ArrowLeftRight size={13} /> Confirm swap
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwapResidentModal;