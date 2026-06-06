import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Wrench, Droplets, Zap, ShieldCheck, Building2, ClipboardList,
  ChevronRight, AlertCircle, Clock, Pin,
} from "lucide-react";
import { usegetNotices } from "../../../../hooks/AdminHooks/NoticeHooks";

// ─── Category & urgency config ────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  maintenance: { label: "Maintenance",  Icon: Wrench,        badge: "bg-amber-50  text-amber-700  border-amber-200",  accent: "border-l-amber-400"  },
  water:       { label: "Water supply", Icon: Droplets,      badge: "bg-blue-50   text-blue-700   border-blue-200",   accent: "border-l-blue-400"   },
  electricity: { label: "Electricity",  Icon: Zap,           badge: "bg-yellow-50 text-yellow-700 border-yellow-200", accent: "border-l-yellow-400" },
  security:    { label: "Security",     Icon: ShieldCheck,   badge: "bg-purple-50 text-purple-700 border-purple-200", accent: "border-l-purple-400" },
  amenities:   { label: "Amenities",   Icon: Building2,     badge: "bg-teal-50   text-teal-700   border-teal-200",   accent: "border-l-teal-400"   },
  other:       { label: "Other",        Icon: ClipboardList, badge: "bg-slate-50  text-slate-600  border-slate-200",  accent: "border-l-slate-300"  },
};

const URGENCY_CONFIG = {
  high:   { label: "High",   Icon: AlertCircle, badge: "bg-red-50   text-red-700   border-red-200"   },
  medium: { label: "Medium", Icon: Clock,       badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const diffMs  = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ Icon, label, className }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${className}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

// ─── Notice row ───────────────────────────────────────────────────────────────
function NoticeRow({ notice, isOpen, onToggle }) {
  const categoryConfig = CATEGORY_CONFIG[notice.category] ?? CATEGORY_CONFIG.other;
  const urgencyConfig  = URGENCY_CONFIG[notice.urgency]   ?? null;

  return (
    <div
      onClick={onToggle}
      className={`bg-white rounded-2xl border border-l-4 overflow-hidden cursor-pointer transition-shadow hover:shadow-md
        ${notice.unread ? "border-slate-200" : "border-slate-100"}
        ${categoryConfig.accent}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">

          {/* Unread indicator */}
          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notice.unread ? "bg-teal-500" : "bg-transparent"}`} />

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <Badge Icon={categoryConfig.Icon} label={categoryConfig.label} className={categoryConfig.badge} />
              {urgencyConfig && (
                <Badge Icon={urgencyConfig.Icon} label={urgencyConfig.label} className={urgencyConfig.badge} />
              )}
              {notice.pinned && (
                <Badge Icon={Pin} label="Pinned" className="bg-blue-50 text-blue-700 border-blue-200" />
              )}
              {notice.unread && (
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>

            {/* Title */}
            <p className={`text-sm font-semibold leading-snug ${notice.unread ? "text-slate-900" : "text-slate-500"}`}>
              {notice.title}
            </p>

            {/* Expanded body */}
            {isOpen && (
              <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                {notice.body}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">{notice.author}</span>
              <span className="text-slate-300">·</span>
              <span>{timeAgo(notice.createdAt)}</span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronRight
            size={15}
            className={`text-slate-300 shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PageNotices() {
  const [openId, setOpenId] = useState(null);
  const [readIds, setReadIds] = useState(new Set());

  const token    = localStorage.getItem("login");
  const decoded  = jwtDecode(token);
  const hostelId = decoded?.hostelId;

  const { data: apiNotices = [] } = usegetNotices(hostelId);

  // Map API fields → shape used by this page
  const notices = apiNotices.map((item) => ({
    id:        item._id,
    category:  item.category  ?? "other",
    urgency:   item.urgency   ?? "normal",
    title:     item.title,
    body:      item.body,
    author:    item.author    ?? "Admin",
    createdAt: item.createdAt,
    pinned:    item.pinned    ?? false,
    unread:    !readIds.has(item._id),
  }));

  const unreadCount    = notices.filter((n) => n.unread).length;
  const pinnedNotices  = notices.filter((n) => n.pinned);
  const regularNotices = notices.filter((n) => !n.pinned);

  function handleToggle(id) {
    setReadIds((prev) => new Set([...prev, id]));
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Notice board</h2>
          <p className="text-sm text-slate-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notice${unreadCount !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>

        {/* Pinned section */}
        {pinnedNotices.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pinned</p>
            {pinnedNotices.map((notice) => (
              <NoticeRow
                key={notice.id}
                notice={notice}
                isOpen={openId === notice.id}
                onToggle={() => handleToggle(notice.id)}
              />
            ))}
          </div>
        )}

        {/* All notices */}
        <div className="space-y-2">
          {pinnedNotices.length > 0 && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All notices</p>
          )}
          {regularNotices.map((notice) => (
            <NoticeRow
              key={notice.id}
              notice={notice}
              isOpen={openId === notice.id}
              onToggle={() => handleToggle(notice.id)}
            />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}