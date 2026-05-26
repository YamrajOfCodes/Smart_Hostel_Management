import { useState } from "react";
import AdminDashboard from "../AdminDashboard";
import { useLogout } from "../../../hooks/authHooks/authHooks";
import HostelCard from "../../../components/AdminComponents/HostelCard/HostelCard";
import SummaryStrip from "../../../components/AdminComponents/SummaryCard/SummaryStrip";
import {Outlet} from "react-router-dom"


const hostelsData = [
  {
    id: 1,
    name: "Sunrise PG & Hostel",
    city: "Pune, Maharashtra",
    totalRooms: 170,
    occupied: 153,
    complaints: 8,
    monthlyRevenue: "₹2.4L",
    status: "active",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Green Valley Boys Hostel",
    city: "Mumbai, Maharashtra",
    totalRooms: 120,
    occupied: 94,
    complaints: 3,
    monthlyRevenue: "₹1.8L",
    status: "active",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Pearl Ladies PG",
    city: "Nagpur, Maharashtra",
    totalRooms: 80,
    occupied: 52,
    complaints: 5,
    monthlyRevenue: "₹1.1L",
    status: "active",
    color: "#8b5cf6",
  },
  {
    id: 4,
    name: "Horizon Co-living",
    city: "Nashik, Maharashtra",
    totalRooms: 60,
    occupied: 13,
    complaints: 1,
    monthlyRevenue: "₹0.3L",
    status: "setup",
    color: "#f59e0b",
  },
];

export default function HostelOverview() {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const { mutate: logout } = useLogout();



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        body { font-family: 'DM Sans', sans-serif; }
        .dot-bg {
          background-image: radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 dot-bg">

        {/* Top navbar */}
        <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="w-full mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              S
            </div>
            <div>
              <p className="font-display font-bold text-slate-800 text-sm leading-tight">
                StayNest HMS
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Owner Portal
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => logout()}
                className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Logout
              </button>
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="w-full mx-auto px-4 sm:px-6 py-8">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-800">
              Your Hostels
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select a hostel to view and manage its dashboard.
            </p>
          </div>

          {/* Summary numbers */}
          <SummaryStrip hostels={hostelsData} />
          

          {/* Hostel cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hostelsData.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                onClick={() => setSelectedHostel(hostel)}
              />
            ))}

            {/* Add new hostel card */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[260px] cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 group-hover:border-blue-400 flex items-center justify-center text-slate-400 group-hover:text-blue-500 text-2xl transition-colors">
                +
              </div>
              <p className="text-sm text-slate-400 group-hover:text-blue-500 mt-3 transition-colors">
                Add new hostel
              </p>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}