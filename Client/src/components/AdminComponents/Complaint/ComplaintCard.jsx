import { Clock, Trash2, DoorOpen, AlertTriangle, Toolbox } from "lucide-react";

const Avatar = ({ initials }) => (
  <div className="w-7 h-7 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[11px] font-semibold text-[#6B5E45] shrink-0">
    {initials}
  </div>
);

const Badge = ({ status }) => {
  const config = {
    pending: {
      label: "Pending",
      className: "bg-[#FAEEDA] text-[#633806]",
      icon: <Clock size={11} />,
    },
    "in-progress": {
      label: "In progress",
      className: "bg-[#E6F1FB] text-[#0C447C]",
      icon: <Clock size={11} />,
    },
    resolved: {
      label: "Resolved",
      className: "bg-[#EAF3DE] text-[#27500A]",
      icon: null,
    },
    rejected: {
      label: "Rejected",
      className: "bg-[#FCEBEB] text-[#791F1F]",
      icon: null,
    },
  };

  const { label, className, icon } = config[status] ?? config["pending"];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

const UrgencyPill = ({ urgency }) => {
  const config = {
    high: { label: "High", className: "bg-[#FCEBEB] text-[#A32D2D]" },
    medium: { label: "Medium", className: "bg-[#FAEEDA] text-[#633806]" },
    low: { label: "Low", className: "bg-[#EAF3DE] text-[#27500A]" },
  };

  const key = urgency?.toLowerCase();
  const { label, className } = config[key] ?? config["low"];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${className}`}
    >
      <AlertTriangle size={10} />
      {label}
    </span>
  );
};

const ComplaintCard = ({ complaint, onStatusChange, onDelete }) => {
  const initials =
    complaint.userId?.name?.slice(0, 2)?.toUpperCase() || "UN";

  const submittedLabel = complaint.date
    ? `Submitted ${complaint.date}`
    : "Date unknown";

  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E3] shadow-sm p-5 hover:border-[#D4CFC9] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            {/* Category */}
            <span className="inline-flex items-center gap-1 bg-[#F0EDE8] text-[#6B5E45] font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <Toolbox size={10} />
              {complaint.category}
            </span>

            <span className="inline-flex items-center gap-1 bg-[#E6F1FB] text-[#0C447C] text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <DoorOpen size={10} />
              {complaint.room}
            </span>

            {/* Urgency — only show if present */}
            {complaint.urgency && (
              <UrgencyPill urgency={complaint.urgency} />
            )}
          </div>

          <p className="text-sm font-bold text-[#1A1714] truncate">
            {complaint.issueTitle}
          </p>
        </div>

        {/* Status badge + delete */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge status={complaint.status} />
          {complaint.status === "resolved" && (
            <button
              onClick={() => onDelete?.(complaint._id)}
              className="inline-flex cursor-pointer items-center justify-center w-7 h-7 rounded-lg border border-[#EAE8E3] text-[#A09890] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              aria-label="Delete complaint"
              title="Delete complaint"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {complaint.details && (
        <p className="text-sm text-[#6B6560] leading-relaxed border-t border-[#F0EDE8] pt-3">
          {complaint.details}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[#F0EDE8] flex-wrap">
        <div className="flex items-center gap-2">
          <Avatar initials={initials} />
          <div>
            <p className="text-xs font-semibold text-[#1A1714] leading-none">
              {complaint.userId?.name || "Unknown"}
            </p>
            <p className="text-[11px] text-[#A09890] mt-0.5 flex items-center gap-1">
              <Clock size={10} className="shrink-0" />
              {submittedLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor={`status-${complaint._id}`}
            className="text-xs text-[#A09890]"
          >
            Update status
          </label>
          <select
            id={`status-${complaint._id}`}
            value={complaint.status}
            onChange={(e) => onStatusChange?.(complaint._id, e.target.value)}
            className="text-xs border border-[#DDD9D4] rounded-lg px-2 py-1 bg-white text-[#1A1714] cursor-pointer outline-none hover:border-[#C8A96E] focus:border-[#C8A96E] transition-colors"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default ComplaintCard;