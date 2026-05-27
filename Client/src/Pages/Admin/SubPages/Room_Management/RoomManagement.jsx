import { useEffect, useState } from "react";
import { Search, Plus, BedDouble, Users, Wrench, Home, MoreVertical, MapPin } from "lucide-react";
import {useParams} from "react-router-dom"
import FloorSection from "../../../../components/AdminComponents/Room_Management/FloorSection/FloorSection";
import RoomAvatarStack from "../../../../components/Reusable/RoomAvtarStack";
import AddRoomModal from "../../../../components/Models/AddRoomModal";
import { useCreateRoom, useGetHosetlById, useGetRooms } from "../../../../hooks/AdminHooks/adminHooks";

// const  = [
//   { id: "1", roomNo: "101", floor: "Ground Floor", beds: 3, occupied: 3, rent: 8000, status: "occupied",  residents: ["Arjun S", "Rahul M", "Karan P"], amenities: ["AC", "WiFi"], roomType: "Triple" },
//   { id: "2", roomNo: "102", floor: "Ground Floor", beds: 2, occupied: 1, rent: 6500, status: "partial",   residents: ["Sneha R"], amenities: ["WiFi"], roomType: "Double" },
//   { id: "3", roomNo: "103", floor: "Ground Floor", beds: 1, occupied: 0, rent: 5000, status: "vacant",    residents: [], amenities: ["AC", "WiFi", "Geyser"], roomType: "Single" },
//   { id: "4", roomNo: "104", floor: "Ground Floor", beds: 2, occupied: 0, rent: 6000, status: "maintenance", residents: [], amenities: ["WiFi"], roomType: "Double" },
//   { id: "5", roomNo: "201", floor: "1st Floor",    beds: 3, occupied: 2, rent: 8500, status: "partial",   residents: ["Amit V", "Rohit K"], amenities: ["AC", "WiFi"], roomType: "Triple" },
//   { id: "6", roomNo: "202", floor: "1st Floor",    beds: 2, occupied: 2, rent: 7000, status: "occupied",  residents: ["Priya T", "Nisha B"], amenities: ["AC"], roomType: "Double" },
//   { id: "7", roomNo: "203", floor: "1st Floor",    beds: 1, occupied: 0, rent: 5500, status: "vacant",    residents: [], amenities: ["WiFi"], roomType: "Single" },
//   { id: "8", roomNo: "301", floor: "2nd Floor",    beds: 4, occupied: 3, rent: 9000, status: "partial",   residents: ["Dev P", "Sam K", "Raj N"], amenities: ["AC", "WiFi", "TV"], roomType: "Quad" },
//   { id: "9", roomNo: "302", floor: "2nd Floor",    beds: 2, occupied: 0, rent: 6800, status: "vacant",    residents: [], amenities: ["WiFi"], roomType: "Double" },
// ];

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


export default function RoomManagement() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeFloor, setActiveFloor] = useState("All");
  const [addRoomModel,setAddRoomModel] = useState(false);
  const {id} = useParams();

  const {mutate:createRoom} = useCreateRoom();
  const {data:MOCK_ROOMS} = useGetRooms(id);
  const {data:gethostelById} = useGetHosetlById(id);

  console.log("gethostelById",gethostelById)

  console.log(activeFloor)



 
  const floors =  Array.from({length:gethostelById?.hostelFloors}).map((element,index)=> index+1);
  floors.unshift("All");

 const filtered = MOCK_ROOMS?.filter(room => {
  const matchFloor  = activeFloor === "All" || room.floor == activeFloor;
  const matchStatus = statusFilter === "all" || room.status === statusFilter;
  const matchSearch = search === "" ||
    room?.roomNo?.toLowerCase()?.includes(search.toLowerCase()) ||
    room?.residents?.some(res => {
      const name = typeof res === "string" ? res : res?.tenantId?.name || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });

  return matchFloor && matchStatus && matchSearch;
});


  console.log(filtered)


  const grouped = floors
    ?.filter(f => f !== "All")
    ?.map(floor => ({ floor, rooms: filtered.filter(room => room.floor === floor) }))
    ?.filter(grd => grd.rooms.length > 0);

  const stats = [
    { label: "Total Rooms",  value: MOCK_ROOMS?.length,                                         icon: <Home size={16} />,    color: "text-slate-700",    iconBg: "bg-slate-100" },
    { label: "Occupied",     value: MOCK_ROOMS?.filter(r => r.status === "occupied").length,     icon: <Users size={16} />,   color: "text-blue-600",     iconBg: "bg-blue-50" },
    { label: "Vacant",       value: MOCK_ROOMS?.filter(r => r.status === "vacant").length,       icon: <BedDouble size={16}/>, color: "text-emerald-600", iconBg: "bg-emerald-50" },
    { label: "Maintenance",  value: MOCK_ROOMS?.filter(r => r.status === "maintenance").length,  icon: <Wrench size={16} />,  color: "text-rose-600",     iconBg: "bg-rose-50" },
  ];

  const handleRoomSubmit = (data)=>{

    const {
        floor,
        monthlyRent,
        roomCategory,
        roomMembers,
        roomNumber,
        roomType,
        securityDeposit,
        status,
        totalBeds,
        amenities,
        notes
    } = data;

     const payload = {
        hostelId:id,
        floor,
        monthlyRent,
        roomCategory,
        roomMembers,
        roomNumber,
        roomType,
        securityDeposit,
        status,
        totalBeds,
        amenities,
        notes
     }

     createRoom(payload,{
      onSuccess:()=>{
        setAddRoomModel(false);
      }
     });
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Room Management</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin size={12} /> Sunshine PG, Koregaon Park
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm self-start sm:self-auto" onClick={()=>{setAddRoomModel(true)}}>
              <Plus size={15} /> Add Room
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {stats.map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl px-3 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0 pb-0.5 sm:pb-0">
            {floors.map(floor => {
              const isActive = activeFloor === floor;
              const accent = floor !== "All" ? FLOOR_ACCENT[floor] : null;
              return (
                <button
                  key={floor}
                  onClick={() => setActiveFloor(floor)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                    ${isActive
                      ? floor === "All"
                        ? "bg-slate-900 text-white border-slate-900"
                        : `${accent} text-white border-transparent`
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                >
{
  floor === "All"
    ? "All"
    : `${floor}${
        floor == 1
          ? "st"
          : floor == 2
          ? "nd"
          : floor == 3
          ? "rd"
          : "th"
      } Floor`
}                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="partial">Partial</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search room or resident…"
                className="w-full sm:w-52 pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Room Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filtered?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <BedDouble size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium text-sm">No rooms match your filters.</p>
          </div>
        ) : activeFloor !== "All" ? (
          <FloorSection floor={activeFloor} rooms={filtered} />
        ) : (
          grouped.map(({ floor, rooms }) => (
            <FloorSection key={floor} floor={floor} rooms={rooms} />
          ))
        )}
      </div>

      {

       addRoomModel && (
         <AddRoomModal
         onClose={()=>{setAddRoomModel(false)}}
         onSubmit={handleRoomSubmit}
         Floors={floors}
         />
        ) 
      }
    </div>
  );
}