import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, MapPin, ArrowUpRight } from "lucide-react";

const generateColor = (id) => {
  const colors = [
    "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
    "#ef4444", "#06b6d4", "#f97316", "#84cc16",
    "#ec4899", "#14b8a6",
  ];
  let hash = 0;
  for (let i = 0; i < id?.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function HostelCard({ hostel, handleEdit, handleDelete,setDeleteId,setShowDeleteModal }) {
  const navigate = useNavigate();
  const color = generateColor(hostel?._id);
  const occupancyPct = hostel?.room
    ? Math.round(((hostel?.occupied || 0) / hostel.room) * 100)
    : 0;
  const free = (hostel?.room || 0) - (hostel?.occupied || 0);

  const handleConfirmation = (id,hostelname)=>{
    setShowDeleteModal(true);
    setDeleteId({
      deleteId:id,
      hostelname
    })
  }

  return (
    <div
      onClick={() => navigate(`/admin/hostels/${hostel?._id}`)}
      className="relative bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)" }}
    >
      {/* Top accent strip */}
      <div className="h-1 w-full" style={{ background: color }} />

      <div className="p-5 flex flex-col gap-4">

        {/* Row 1: Avatar + Actions */}
        <div className="flex items-center justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: color }}
          >
            {hostel?.hostelName?.[0]?.toUpperCase()}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleEdit(hostel?._id, hostel); }}
              className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleConfirmation(hostel?._id,hostel?.hostelName); }}
              className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: Name + Address */}
        <div>
          <h3 className="font-semibold text-slate-800 text-[15px] leading-tight">
            {hostel?.hostelName}
          </h3>
          {hostel?.address && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin size={11} />
              {hostel.address}
            </p>
          )}
        </div>

        {/* Row 3: Stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 rounded-xl overflow-hidden">
          {[
            { label: "Rooms", value: hostel?.room ?? "—" },
            { label: "Occupied", value: hostel?.occupied ?? 0 },
            { label: "Complaints", value: hostel?.complaints ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <span className="text-base font-bold text-slate-800">{value}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Row 4: Occupancy bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{occupancyPct}% occupancy</span>
            <span className="font-medium" style={{ color }}>{free} free</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyPct}%`, background: color }}
            />
          </div>
        </div>

        {/* Row 5: Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {hostel?.monthlyRevenue ? `₹${hostel.monthlyRevenue}/mo` : "No revenue data"}
          </span>
          <span
            className="text-xs font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color }}
          >
            Open <ArrowUpRight size={13} />
          </span>
        </div>

      </div>
    </div>
  );
}

export default HostelCard;