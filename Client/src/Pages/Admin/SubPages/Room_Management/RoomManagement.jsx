import { useState } from "react";
import AddRoomModal from "../../../../components/Models/AddRoomModal";
import { useCreateRoom, useGetRooms } from "../../../../hooks/AdminHooks/adminHooks";
import { jwtDecode } from "jwt-decode";
import RoomSkeleton from "../../../../components/Loaders/RoomSkeleton/LoadingSkeleton";
import FloorSection from "../../../../components/AdminComponents/RoomManagementSection/FloorSection/FlooSection";
import FloorTab from "../../../../components/AdminComponents/RoomManagementSection/FloorTab/FloorTab";

// ─── ICONS ───────────────────────────────────────────────────
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

// ─── FLOOR / STATUS CONFIG ────────────────────────────────────
const floorColors = {
  "Ground Floor": { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "1st Floor":    { bg: "bg-sky-500",    light: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500" },
  "2nd Floor":    { bg: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500" },
  "3rd Floor":    { bg: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
};

const DEFAULT_FLOOR_COLOR = { bg: "bg-slate-500", light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" };

const statusConfig = {
  occupied:    { label: "Occupied",    badge: "bg-blue-100 text-blue-700 border-blue-200",          bar: "bg-blue-500",    dot: "bg-blue-500" },
  vacant:      { label: "Vacant",      badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400", dot: "bg-emerald-500" },
  partial:     { label: "Partial",     badge: "bg-amber-100 text-amber-700 border-amber-200",       bar: "bg-amber-400",   dot: "bg-amber-500" },
  maintenance: { label: "Maintenance", badge: "bg-rose-100 text-rose-700 border-rose-200",          bar: "bg-rose-400",    dot: "bg-rose-500" },
};

// ─── HELPERS ─────────────────────────────────────────────────
// Normalize a raw API room object to what the UI expects
function normalizeRoom(room) {
  return {
    id:        room._id,
    roomNo:    room.roomNumber,
    floor:     room.floor,
    beds:      Number(room.beds),
    occupied:  Array.isArray(room.roomMembers) ? room.roomMembers.length : 0,
    rent:      room.roomRent,
    status:    room.status || "vacant",
    residents: Array.isArray(room.roomMembers) ? room.roomMembers : [],
    amenities: room.amenities || [],
    roomType:  room.roomType,
    notes:     room.notes || "",
  };
}

// ─── AVATAR STACK ─────────────────────────────────────────────
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




// ─── MAIN PAGE ────────────────────────────────────────────────
export default function RoomManagement() {
  const [activeFloor, setActiveFloor] = useState("All Floors");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddRoom, setShowAddRoom] = useState(false);

  // ── Auth ──
  const token = localStorage.getItem("login");
  const hostelId = token ? jwtDecode(token)._id : null;

  // ── Hooks ──
  const { data: rawRooms = [], isLoading, isError } = useGetRooms(hostelId);
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom(hostelId);

  // ── Normalize API data ──
  const rooms = rawRooms.map(normalizeRoom);

  // ── Derived floors list ──
  const uniqueFloors = ["All Floors", ...new Set(rooms.map(r => r.floor))];

  // ── Filters ──
  const filtered = rooms.filter(r => {
    const matchFloor  = activeFloor === "All Floors" || r.floor === activeFloor;
    const matchSearch = r.roomNo.toLowerCase().includes(search.toLowerCase()) ||
      r.residents.some(res => String(res).toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchFloor && matchSearch && matchStatus;
  });

  const floorRoomCount = (floor) =>
    floor === "All Floors" ? rooms.length : rooms.filter(r => r.floor === floor).length;

  const groupedByFloor = uniqueFloors
    .filter(f => f !== "All Floors")
    .map(floor => ({ floor, rooms: filtered.filter(r => r.floor === floor) }))
    .filter(g => g.rooms.length > 0);

  // ── Stats ──
  const totalBeds    = rooms.reduce((a, r) => a + r.beds, 0);
  const occupiedBeds = rooms.reduce((a, r) => a + r.occupied, 0);
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // ── Add Room ──
  const handleAddRoom = (data) => {
    const payload = {
      hostelId,
      floor:       data.floor,
      roomNumber:  data.roomNumber,
      roomType:    data.roomType,
      beds:        Number(data.roomSharing),
      roomRent:    Number(data.roomRent),
      amenities:   data.amenities || [],
      notes:       data.notes || "",
      roomMembers: [],
    };
    createRoom(payload, { onSuccess: () => setShowAddRoom(false) });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 p-4 gap-1">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <Icon d={Icons.building} size={15} stroke="white" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight">PG Manager</span>
          </div>
          <p className="text-xs text-slate-400 pl-10">Room Management</p>
        </div>

        {/* Overall occupancy */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4">
          <p className="text-xs text-slate-400 mb-1">Overall Occupancy</p>
          <p className="text-2xl font-black text-white mb-2">{occupancyPct}%</p>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${occupancyPct}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">{occupiedBeds}/{totalBeds} beds occupied</p>
        </div>

        {/* Floor navigation */}
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-2 mb-2">Floors</p>
        <div className="flex flex-col gap-1">
          {uniqueFloors.map(floor => (
            <FloorTab
              key={floor}
              label={floor}
              count={floorRoomCount(floor)}
              active={activeFloor === floor}
              onClick={() => setActiveFloor(floor)}
            />
          ))}
        </div>

        {/* Status legend */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 px-2">Status</p>
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 px-2 py-1.5">
              <div className={`w-2 h-2 rounded-full ${val.dot}`} />
              <span className="text-xs text-slate-600 font-medium">{val.label}</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">
                {rooms.filter(r => r.status === key).length}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {activeFloor === "All Floors" ? "All Rooms" : activeFloor}
            </h1>
            <p className="text-xs text-slate-400">{filtered.length} rooms shown</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="partial">Partial</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon d={Icons.search} size={14} />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search room or resident…"
                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 w-56"
              />
            </div>

            <button
              onClick={() => setShowAddRoom(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Icon d={Icons.plus} size={14} />
              Add Room
            </button>
          </div>
        </header>

        {/* Mobile floor pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto px-4 pt-4 pb-0 scrollbar-none">
          {uniqueFloors.map(floor => {
            const fc = floor !== "All Floors" ? floorColors[floor] : null;
            const active = activeFloor === floor;
            return (
              <button
                key={floor}
                onClick={() => setActiveFloor(floor)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all
                  ${active
                    ? floor === "All Floors"
                      ? "bg-slate-900 text-white border-slate-900"
                      : `${fc?.bg} text-white border-transparent`
                    : "bg-white text-slate-600 border-slate-200"
                  }`}
              >
                {floor} ({floorRoomCount(floor)})
              </button>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 pt-5 pb-0">
          {[
            { label: "Total Rooms",  value: rooms.length,                                      color: "text-slate-800" },
            { label: "Occupied",     value: rooms.filter(r => r.status === "occupied").length,  color: "text-blue-600" },
            { label: "Vacant",       value: rooms.filter(r => r.status === "vacant").length,    color: "text-emerald-600" },
            { label: "Maintenance",  value: rooms.filter(r => r.status === "maintenance").length, color: "text-rose-600" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rooms */}
        <div className="p-6 flex-1">
          {isLoading ? (
            <RoomSkeleton />
          ) : isError ? (
            <div className="bg-white border border-rose-100 rounded-2xl p-16 text-center">
              <p className="text-rose-400 font-medium">Failed to load rooms. Please try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
              <p className="text-slate-400 font-medium">No rooms found matching your filters.</p>
            </div>
          ) : activeFloor === "All Floors" ? (
            groupedByFloor.map(({ floor, rooms }) => (
              <FloorSection key={floor} floorName={floor} rooms={rooms} />
            ))
          ) : (
            <FloorSection floorName={activeFloor} rooms={filtered} />
          )}
        </div>
      </main>

      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onSubmit={handleAddRoom}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}