const DEFAULT_FLOOR_COLOR = { bg: "bg-slate-500", light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" };

const statusConfig = {
  occupied:    { label: "Occupied",    badge: "bg-blue-100 text-blue-700 border-blue-200",          bar: "bg-blue-500",    dot: "bg-blue-500" },
  vacant:      { label: "Vacant",      badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400", dot: "bg-emerald-500" },
  partial:     { label: "Partial",     badge: "bg-amber-100 text-amber-700 border-amber-200",       bar: "bg-amber-400",   dot: "bg-amber-500" },
  maintenance: { label: "Maintenance", badge: "bg-rose-100 text-rose-700 border-rose-200",          bar: "bg-rose-400",    dot: "bg-rose-500" },
};

const floorColors = {
  "Ground Floor": { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "1st Floor":    { bg: "bg-sky-500",    light: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500" },
  "2nd Floor":    { bg: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500" },
  "3rd Floor":    { bg: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
};

function AvatarStack({ residents }) {
  const colors = ["bg-blue-400", "bg-violet-400", "bg-teal-400", "bg-amber-400", "bg-rose-400"];
  return (
    <div className="flex items-center">
      {residents.slice(0, 3).map((r, i) => (
        <div
          key={i}
          className={`w-7 h-7 rounded-full ${colors[i % colors.length]} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}
          style={{ marginLeft: i > 0 ? "-8px" : "0", zIndex: 10 - i }}
          title={r}
        >
          {String(r)[0]?.toUpperCase() || "?"}
        </div>
      ))}
      {residents.length > 3 && (
        <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-[10px] font-bold" style={{ marginLeft: "-8px" }}>
          +{residents.length - 3}
        </div>
      )}
      {residents.length === 0 && (
        <span className="text-xs text-slate-400 italic">No residents</span>
      )}
    </div>
  );
}


const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);


const Icons = {
  search: "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5",
  plus: "M12 5v14 M5 12h14",
  bed: ["M2 4v16", "M2 10h20", "M6 10V7a3 3 0 013-3h3a3 3 0 013 3v3", "M22 16v4"],
  edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
  building: ["M3 21h18", "M5 21V7l8-4v18", "M19 21V11l-6-4", "M9 9v.01", "M9 12v.01", "M9 15v.01", "M9 18v.01"],
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 7a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
};



function RoomCard({ room }) {
  const occupancy = room.beds > 0 ? (room.occupied / room.beds) * 100 : 0;
  const status = statusConfig[room.status] || statusConfig.vacant;
  const fc = floorColors[room.floor] || DEFAULT_FLOOR_COLOR;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className={`h-1 w-full ${fc.dot}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${fc.light} ${fc.text} flex items-center justify-center font-black text-sm`}>
              {room.roomNo}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">Room {room.roomNo}</h3>
              <span className={`text-[10px] font-semibold ${fc.text} ${fc.light} px-2 py-0.5 rounded-full`}>{room.floor}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold capitalize px-2.5 py-1 rounded-full border ${status.badge}`}>
              {status.label}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{room.roomType}</span>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Occupancy</span>
            <span className="font-semibold text-slate-700">{room.occupied}/{room.beds} beds</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>

        {/* Rent */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Monthly Rent</span>
          <span className="text-base font-black text-slate-800">₹{room.rent.toLocaleString("en-IN")}</span>
        </div>

        {/* Amenities */}
        {room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                {a}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                +{room.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Residents */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Residents</span>
          <AvatarStack residents={room.residents} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
          <button className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
            <Icon d={Icons.eye} size={12} />
            View
          </button>
          <button className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-all">
            <Icon d={Icons.edit} size={13} />
          </button>
          <button className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-slate-400 transition-all">
            <Icon d={Icons.trash} size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;