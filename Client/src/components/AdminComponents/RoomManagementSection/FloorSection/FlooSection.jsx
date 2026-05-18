import RoomCard from "../RoomCard/RoomCard";

const floorColors = {
  "Ground Floor": { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "1st Floor":    { bg: "bg-sky-500",    light: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500" },
  "2nd Floor":    { bg: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500" },
  "3rd Floor":    { bg: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
};

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

const DEFAULT_FLOOR_COLOR = { bg: "bg-slate-500", light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" };

const statusConfig = {
  occupied:    { label: "Occupied",    badge: "bg-blue-100 text-blue-700 border-blue-200",          bar: "bg-blue-500",    dot: "bg-blue-500" },
  vacant:      { label: "Vacant",      badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400", dot: "bg-emerald-500" },
  partial:     { label: "Partial",     badge: "bg-amber-100 text-amber-700 border-amber-200",       bar: "bg-amber-400",   dot: "bg-amber-500" },
  maintenance: { label: "Maintenance", badge: "bg-rose-100 text-rose-700 border-rose-200",          bar: "bg-rose-400",    dot: "bg-rose-500" },
};

function FloorSection({ floorName, rooms }) {
  const fc = floorColors[floorName] || DEFAULT_FLOOR_COLOR;
  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === "occupied").length;
  const vacant = rooms.filter(r => r.status === "vacant").length;

  return (
    <div className="mb-8">
      <div className={`flex items-center justify-between mb-4 px-4 py-3 ${fc.light} rounded-2xl border ${fc.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl ${fc.bg} flex items-center justify-center`}>
            <Icon d={Icons.building} size={14} stroke="white" />
          </div>
          <div>
            <h2 className={`font-bold text-base ${fc.text}`}>{floorName}</h2>
            <p className="text-xs text-slate-500">{total} rooms · {occupied} occupied · {vacant} vacant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {["occupied", "partial", "vacant", "maintenance"].map(s => {
            const cnt = rooms.filter(r => r.status === s).length;
            if (!cnt) return null;
            return (
              <span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig[s].badge}`}>
                {cnt} {statusConfig[s].label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map(room => <RoomCard key={room.id} room={room} />)}
      </div>
    </div>
  );
}

export default FloorSection;