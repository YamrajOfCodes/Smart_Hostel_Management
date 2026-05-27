import RoomCard from "../RoomCard/RoomCard";

const FLOOR_ACCENT = {
  "Ground Floor": "bg-violet-500",
  "1st Floor":    "bg-sky-500",
  "2nd Floor":    "bg-teal-500",
  "3rd Floor":    "bg-amber-500",
};


function FloorSection({ floor, rooms }) {
  const accent = FLOOR_ACCENT[floor] || "bg-slate-500";
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-2 h-5 rounded-full ${accent}`} />
        <h2 className="font-bold text-slate-800 text-sm tracking-wide uppercase">{floor}</h2>
        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{rooms.length} rooms</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {rooms.map(r => <RoomCard key={r.id} room={r} />)}
      </div>
    </div>
  );
}

export default FloorSection;