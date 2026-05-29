import { BadgeCheck, BedDouble, UserPlus, X } from "lucide-react";
import MemberRow from "../AdminComponents/Room_Management/MemberRow/MemberRow";

const STATUS = {
  occupied:    { label: "Occupied",    bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    border: "border-blue-100" },
  vacant:      { label: "Vacant",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-100" },
  partial:     { label: "Partial",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-100" },
  maintenance: { label: "Maintenance", bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500",    border: "border-rose-100" },
};

const FLOOR_ACCENT = {
  "Ground Floor": "bg-violet-500",
  "1st Floor":    "bg-sky-500",
  "2nd Floor":    "bg-teal-500",
  "3rd Floor":    "bg-amber-500",
};

const AVATAR_PALETTE = ["bg-blue-500", "bg-violet-500", "bg-teal-500", "bg-amber-500", "bg-rose-500"];


function RoomMembersPopup({ room, onClose, onUnassign, onAddResident }) {
const s = STATUS[room.status] ?? STATUS["vacant"];
  const occupied = room.roomMembers?.length || 0;
  const free     = room.totalBeds - occupied;

  console.log(room)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}
      >

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${FLOOR_ACCENT[room.floor] || "bg-slate-500"} flex items-center justify-center`}>
                <BedDouble size={17} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-[15px]">Room {room.roomNumber}</p>
                <p className="text-xs text-slate-400">{room.floor} · {room.roomType} · {room.totalBeds} beds</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* Room stats strip */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Total beds",  value: room.totalBeds },
              { label: "Occupied",    value: occupied },
              { label: "Available",   value: free },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl py-2.5 text-center">
                <p className="text-base font-black text-slate-800">{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 max-h-72">
          {occupied === 0 ? (
            <div className="py-10 text-center">
              <BedDouble size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No residents assigned yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {room.roomMembers.map((member, i) => (
                <MemberRow
                  key={member?.tenantId?._id || i}
                  member={member}
                  roomId={room?._id}
                  index={i}
                  onUnassign={onUnassign}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </div>

          {free > 0 && (
            <button
              onClick={onAddResident}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              <UserPlus size={13} /> Add Resident
            </button>
          )}

          {free === 0 && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
              <BadgeCheck size={13} /> Room is full
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomMembersPopup;