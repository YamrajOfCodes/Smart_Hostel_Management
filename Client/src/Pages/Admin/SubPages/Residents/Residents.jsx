import { useState } from "react";
import ResidentCard from "../../../../components/AdminComponents/ResidentSection/ResidentCard/ResidentCard";
import AddResidentModal from "../../../../components/Models/AddResidentModal";
import { useAssignedRoom, useGetHosetlById, useGetRooms } from "../../../../hooks/AdminHooks/adminHooks";
import { useParams } from "react-router-dom";

// ─────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

const Icons = {
  search: [
    "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z",
    "M16 16l4.5 4.5",
  ],

  plus: "M12 5v14 M5 12h14",

  users: [
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
    "M23 21v-2a4 4 0 00-3-3.87",
    "M16 3.13a4 4 0 010 7.75",
    "M9 7a4 4 0 100 8 4 4 0 000-8z",
  ],

  close: "M18 6L6 18 M6 6l12 12",

  phone: ["M22 16.92v3a2 2 0 01-2.18 2", "M16 3h3a2 2 0 012 2v3", "M5 3h3", "M3 5v3", "M16 8a6 6 0 006 6"],

  mail: [
    "M4 4h16v16H4z",
    "M22 6l-10 7L2 6",
  ],

  room: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],

  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 100 6 3 3 0 000-6z",
  ],

  edit: [
    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
    "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  ],

  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
};

// ─────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────
const initialResidents = [
  {
    id: 1,
    name: "Rahul Sharma",
    room: "A-101",
    floor: "1st Floor",
    phone: "9876543210",
    email: "rahul@gmail.com",
    rent: 8500,
    status: "active",
  },

  {
    id: 2,
    name: "Priya Patel",
    room: "B-203",
    floor: "2nd Floor",
    phone: "9876541230",
    email: "priya@gmail.com",
    rent: 9200,
    status: "active",
  },

  {
    id: 3,
    name: "Rohan Verma",
    room: "C-301",
    floor: "3rd Floor",
    phone: "9988776655",
    email: "rohan@gmail.com",
    rent: 7800,
    status: "pending",
  },

  {
    id: 4,
    name: "Sneha Joshi",
    room: "A-103",
    floor: "1st Floor",
    phone: "9123456789",
    email: "sneha@gmail.com",
    rent: 8800,
    status: "active",
  },
];

// ─────────────────────────────────────────────────────
// HELPERS




// MAIN PAGE
// ─────────────────────────────────────────────────────
export default function ResidentsSection() {
  const [residents, setResidents] =
    useState(initialResidents);

  const [search, setSearch] = useState("");

   const {id} = useParams();
  const {data:gethostelById} = useGetHosetlById(id);
   const {data:rooms} = useGetRooms(id);
   const {mutate:assigneroom} = useAssignedRoom();


 const floors =  Array.from({length:gethostelById?.hostelFloors}).map((element,index)=> index+1);


  console.log(gethostelById)

  const [showModal, setShowModal] = useState(false);

  const filteredResidents = residents.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const addResident = (resident) => {
    console.log(resident)
    assigneroom(resident)
    resident.hostelId = id;
    setResidents((prev) => [resident, ...prev]);
  };

  return (
    <>
      <style>{`
        @keyframes scale {
          from {
            opacity: 0;
            transform: scale(.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale {
          animation: scale .25s ease;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 p-4 lg:p-6">

        {/* TOPBAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Residents
            </h1>

            <p className="text-slate-500 mt-1">
              Manage all hostel residents
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* SEARCH */}
            <div className="relative">

              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon d={Icons.search[0]} size={15} />
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search residents..."
                className="w-full sm:w-72 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              <Icon d={Icons.plus} size={16} />
              Add Resident
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">
              Total Residents
            </p>

            <h2 className="text-3xl font-bold text-slate-800">
              {residents.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">
              Active
            </p>

            <h2 className="text-3xl font-bold text-emerald-600">
              {
                residents.filter(
                  (r) => r.status === "active"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-amber-600">
              {
                residents.filter(
                  (r) => r.status === "pending"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">
              Floors
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              3
            </h2>
          </div>
        </div>

        {/* RESIDENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredResidents.map((resident) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
            />
          ))}
        </div>

        {/* EMPTY */}
        {filteredResidents.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center mt-6">
            <p className="text-slate-400">
              No residents found.
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <AddResidentModal
          onClose={() => setShowModal(false)}
          onAdd={addResident}
          floors={floors}
          rooms={rooms}
        />
      )}
    </>
  );
}