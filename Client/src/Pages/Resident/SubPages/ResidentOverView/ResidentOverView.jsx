import { useState } from "react";
import {
  AlertTriangle,
  Wrench,
  FileText,
  LogOut,
  Bell,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Droplets,
  Zap,
  ShieldCheck,
} from "lucide-react";

// ─── Static resident data ────────────────────────────────────────────────────
const RESIDENT = {
  name: "Arjun Mehta",
  room: "Flat 4B",
  floor: "4th Floor",
  joined: "Jan 2023",
  rent: 18500,
  dueDate: "5 Jul 2025",
  paidPercent: 72,
};

// ─── Sample notices ───────────────────────────────────────────────────────────
const INITIAL_NOTICES = [
  { id: 1, title: "Water supply interrupted Saturday 6am–2pm", body: "Annual tank cleaning. Please store sufficient water.", category: "water",       urgency: "high",   unread: true,  date: "2h ago"  },
  { id: 2, title: "Lift #2 out of service Monday 9am–5pm",     body: "Please use Lift #1 during maintenance hours.",   category: "maintenance", urgency: "medium", unread: true,  date: "1d ago"  },
  { id: 3, title: "AGM scheduled — 15th June at 7pm",          body: "All residents encouraged to attend. Agenda TBD.", category: "other",       urgency: "normal", unread: false, date: "3d ago"  },
];

// ─── Sample complaints ────────────────────────────────────────────────────────
const COMPLAINTS = [
  { id: 1, title: "Leaking pipe in bathroom",   category: "Plumbing",  date: "2 Jun", status: "in-progress" },
  { id: 2, title: "Broken window latch, 4B",    category: "Carpentry", date: "28 May", status: "resolved"   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "in-progress": { label: "In progress", Icon: Clock,         className: "bg-amber-50 text-amber-700 border-amber-200"  },
  resolved:       { label: "Resolved",   Icon: CheckCircle2,  className: "bg-green-50 text-green-700 border-green-200"  },
  rejected:       { label: "Rejected",   Icon: XCircle,       className: "bg-red-50   text-red-700   border-red-200"    },
  open:           { label: "Open",       Icon: AlertTriangle, className: "bg-slate-50 text-slate-600 border-slate-200"  },
};

const CATEGORY_ICON = {
  water:       Droplets,
  maintenance: Wrench,
  electricity: Zap,
  security:    ShieldCheck,
  other:       Bell,
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${config.className}`}>
      <config.Icon size={11} />
      {config.label}
    </span>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────
function QuickActionCard({ Icon, label, sub, onClick, colorClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[140px] relative overflow-hidden rounded-2xl p-4 text-left cursor-pointer border-none ${colorClass} hover:-translate-y-0.5 transition-transform`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
        <Icon size={19} color="white" />
      </div>
      <p className="font-semibold text-sm text-white leading-tight">{label}</p>
      <p className="text-[11px] text-white/70 mt-1">{sub}</p>
      <div className="absolute -right-3 -bottom-3 w-14 h-14 rounded-full bg-white/10" />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResidentHome() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);

  const unreadCount = notices.filter((n) => n.unread).length;

  function markRead(id) {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto px-4 py-6 space-y-4">

        {/* ── Hero card ───────────────────────────────────────────────── */}
        <div className="rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-br from-[#0f4c75] via-[#1b6ca8] to-[#118ab2]">
          <div className="absolute -right-5 -top-5 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute right-5 -bottom-2 w-14 h-14 rounded-full bg-white/10" />
          <div className="relative z-10">
            <p className="text-sm text-white/70 font-medium mb-1">Good morning 👋</p>
            <h2 className="text-2xl font-bold text-white mb-3">{RESIDENT.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">🏠 {RESIDENT.room}</span>
              <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">{RESIDENT.floor}</span>
              <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">📅 Since {RESIDENT.joined}</span>
            </div>
          </div>
        </div>

        {/* ── Rent card ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Rent Due</p>
              <p className="text-3xl font-bold text-slate-800">₹{RESIDENT.rent.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Due by</p>
              <p className="text-sm font-bold text-red-500">{RESIDENT.dueDate}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all"
              style={{ width: `${RESIDENT.paidPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Billing cycle: Monthly</span>
            <button className="text-xs text-teal-600 font-bold bg-transparent border-none cursor-pointer hover:underline">
              View invoices →
            </button>
          </div>
        </div>

        {/* ── Quick actions ───────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            <QuickActionCard Icon={AlertTriangle} label="Raise Complaint" sub="Report an issue"    colorClass="bg-gradient-to-br from-red-500 to-red-600"      onClick={() => {}} />
            <QuickActionCard Icon={Wrench}        label="Request Service" sub="Maintenance & more" colorClass="bg-gradient-to-br from-sky-500 to-sky-600"       onClick={() => {}} />
            <QuickActionCard Icon={FileText}      label="My Invoices"     sub="Download receipts"  colorClass="bg-gradient-to-br from-violet-500 to-violet-600"  onClick={() => {}} />
            <QuickActionCard Icon={LogOut}        label="Notice Period"   sub="Plan your exit"     colorClass="bg-gradient-to-br from-amber-400 to-amber-500"    onClick={() => {}} />
          </div>
        </div>

        {/* ── Latest notices ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">Latest Notices</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-teal-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <button className="text-xs text-teal-600 font-bold bg-transparent border-none cursor-pointer hover:underline flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {notices.slice(0, 3).map((notice) => {
              const CategoryIcon = CATEGORY_ICON[notice.category] ?? Bell;
              return (
                <button
                  key={notice.id}
                  onClick={() => markRead(notice.id)}
                  className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left bg-transparent border-none cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.unread ? "bg-teal-500" : "bg-slate-200"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${notice.unread ? "text-slate-800" : "text-slate-500"}`}>
                      {notice.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{notice.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400">{notice.date}</span>
                    <CategoryIcon size={12} className="text-slate-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Complaints preview ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">My Complaints</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer">
              <Plus size={12} /> New
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {COMPLAINTS.map((complaint) => (
              <div key={complaint.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{complaint.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{complaint.category} · {complaint.date}</p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer spacer ───────────────────────────────────────────── */}
        <div className="h-4" />
      </div>
    </div>
  );
}