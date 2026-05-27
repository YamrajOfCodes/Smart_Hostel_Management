import { BedDouble } from "lucide-react";
import RoomAvatarStack from "../../../Reusable/RoomAvtarStack";


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

function RoomCard({ room }) {
  const s = STATUS[room.status];
  const fillPct = room.totalBeds > 0 ? Math.round((room.roomMembers?.length / room.totalBeds) * 100) : 0;
  const barColor = { occupied: "bg-blue-500", partial: "bg-amber-400", vacant: "bg-emerald-400", maintenance: "bg-rose-400" }[room.status];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${FLOOR_ACCENT[room.floor] || "bg-slate-500"} flex items-center justify-center`}>
            <BedDouble size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">Room {room.roomNumber}</p>
            <p className="text-[11px] text-slate-400">{room.roomType} · {room.totalBeds} beds</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </div>
      </div>

      {/* Occupancy bar */}
      <div>
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-slate-400">{room.roomMembers?.length}/{room.totalBeds} occupied</span>
          <span className="font-medium text-slate-600">{fillPct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${fillPct}%` }} />
        </div>
      </div>

      {/* Residents */}
      <div className="flex items-center justify-between">
        <RoomAvatarStack residents={room.residents} />
        <span className="text-xs font-semibold text-slate-700">₹{room?.monthlyRent?.toLocaleString()}<span className="text-slate-400 font-normal">/mo</span></span>
      </div>

      {/* Amenities */}
      {room.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-50">
          {room.amenities.slice(0, 4).map(amnty => (
            <span key={amnty} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-500 font-medium">{amnty?.toUpperCase()}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomCard;