import { Link } from "react-router-dom";

function HostelCard({ hostel, onClick }) {
  const available = hostel.totalRooms - hostel.occupied;
  const occupancyPct = Math.round((hostel.occupied / hostel.totalRooms) * 100);

  return (
    <Link
      to={`/admin/hostels/${hostel.id}`}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      {/* Color bar on top */}
      <div className="h-1.5" style={{ background: hostel.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
            style={{ background: hostel.color }}
          >
            {hostel.name[0]}
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              hostel.status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {hostel.status === "active" ? "Active" : "Setup pending"}
          </span>
        </div>

        {/* Name & location */}
        <h3 className="font-bold text-slate-800 text-base leading-snug">
          {hostel.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{hostel.city}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{hostel.totalRooms}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Rooms</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{hostel.occupied}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Occupied</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{hostel.complaints}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Complaints</p>
          </div>
        </div>

        {/* Occupancy bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">{occupancyPct}% occupancy</span>
            <span className="text-xs text-emerald-600 font-semibold">
              {available} free
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyPct}%`, background: hostel.color }}
            />
          </div>
        </div>

        {/* Open button — appears on hover */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">{hostel.monthlyRevenue} / month</span>
          <span
            className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: hostel.color }}
          >
            Open dashboard →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default HostelCard;