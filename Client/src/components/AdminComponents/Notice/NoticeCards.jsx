import { useState } from "react";
import {
  Pin,
  Pencil,
  Trash2,
  Wrench,
  Droplets,
  Zap,
  ShieldCheck,
  Building2,
  ClipboardList,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";

const CATEGORY_CONFIG = {
  maintenance: { label: "Maintenance",   Icon: Wrench,       className: "bg-amber-50  text-amber-700  border-amber-200"  },
  water:        { label: "Water supply",  Icon: Droplets,     className: "bg-blue-50   text-blue-700   border-blue-200"   },
  electricity:  { label: "Electricity",   Icon: Zap,          className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  security:     { label: "Security",      Icon: ShieldCheck,  className: "bg-purple-50 text-purple-700 border-purple-200" },
  amenities:    { label: "Amenities",     Icon: Building2,    className: "bg-teal-50   text-teal-700   border-teal-200"   },
  other:        { label: "Other",         Icon: ClipboardList, className: "bg-slate-50 text-slate-600  border-slate-200"  },
};

const URGENCY_CONFIG = {
  high:   { label: "High",   Icon: AlertCircle, className: "bg-red-50    text-red-700    border-red-200"    },
  medium: { label: "Medium", Icon: Clock,       className: "bg-amber-50  text-amber-700  border-amber-200"  },
};

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Badge({ Icon, label, className }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${className}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

export default function NoticeCard({ notice, onEdit, onDelete, onPin }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const BODY_TRUNCATE_LENGTH = 160;
  const isBodyLong = notice.body.length > BODY_TRUNCATE_LENGTH;
  const displayBody =
    isBodyLong && !isExpanded
      ? notice.body.slice(0, BODY_TRUNCATE_LENGTH) + "…"
      : notice.body;

  const categoryConfig = CATEGORY_CONFIG[notice.category] ?? null;
  const urgencyConfig = URGENCY_CONFIG[notice.urgency] ?? null;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md
      ${notice.pinned ? "border-blue-200" : "border-slate-200"}`}
    >
      {notice.pinned && <div className="h-0.5 bg-blue-600" />}

      <div className="p-4">

        {/* Top row: badges + actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {notice.pinned && (
              <Badge Icon={Pin} label="Pinned" className="bg-blue-50 text-blue-700 border-blue-200" />
            )}
            {categoryConfig && (
              <Badge Icon={categoryConfig.Icon} label={categoryConfig.label} className={categoryConfig.className} />
            )}
            {urgencyConfig && (
              <Badge Icon={urgencyConfig.Icon} label={urgencyConfig.label} className={urgencyConfig.className} />
            )}
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => onEdit(notice)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(notice._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1.5">
          {notice.title}
        </h3>

        {/* Body */}
        <p className="text-sm text-slate-500 leading-relaxed">{displayBody}</p>
        {isBodyLong && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-medium text-blue-600 hover:underline mt-1"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
          <User size={13} className="shrink-0" />
          <span className="font-medium text-slate-500">{notice.author}</span>
          <span className="text-slate-300">·</span>
          <span>{timeAgo(notice.createdAt)}</span>
        </div>

      </div>
    </div>
  );
}