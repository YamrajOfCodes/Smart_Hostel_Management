import { useState, useEffect } from "react";
import ComplaintModal from "../../components/ResidentComponents/ComplaintModal/ComplaintModal";
import ServiceModal from "../../components/ResidentComponents/ServiceModal/ServiceModal";
import NoticePeriodModal from "../../components/ResidentComponents/NoticePeriodModal/NoticePeriodModal";

/* ─── Icon ────────────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 18, sw = 2, fill = "none", stroke = "currentColor" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0 block"
  >
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const IC = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  bell:    ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  warn:    ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  wrench:  ["M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"],
  file:    ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logout:  ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:    ["M3 12h18","M3 6h18","M3 18h18"],
  close:   ["M18 6L6 18","M6 6l12 12"],
  plus:    ["M12 5v14","M5 12h14"],
  dl:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  check:   "M20 6L9 17l-5-5",
  clock:   ["M12 2a10 10 0 100 20 10 10 0 000-20z","M12 6v6l4 2"],
  send:    ["M22 2L11 13","M22 2L15 22l-4-9-9-4 22-7z"],
  cal:     ["M3 9h18","M16 3v4","M8 3v4","M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"],
  chevR:   ["M9 18l6-6-6-6"],
  chat:    ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
};

/* ─── Data ────────────────────────────────────────────────────────────────── */
const RESIDENT = {
  name: "Rahul Sharma", room: "A-204", floor: "2nd Floor, Block A",
  joined: "15 Jan 2025", rent: 8500, due: "Apr 5, 2026",
  pg: "Sunrise PG & Hostel", addr: "Survey No. 14, Baner, Pune – 411045",
};

const NOTICES_INIT = [
  { id:1, title:"Water Maintenance – Apr 3",  body:"Water supply will be off from 10am–2pm on April 3rd for scheduled maintenance. Please store water beforehand.", date:"30 Mar", type:"maintenance", unread:true },
  { id:2, title:"New Mess Menu from April",    body:"Exciting new menu starting April 1st! Sunday brunch now includes south Indian specials.", date:"28 Mar", type:"info", unread:true },
  { id:3, title:"April Rent Due Reminder",     body:"Please pay your April rent by April 5th to avoid a late fee of ₹200/day.", date:"27 Mar", type:"alert", unread:false },
  { id:4, title:"Gym Equipment Serviced",      body:"The gym equipment on ground floor has been serviced and is fully operational.", date:"24 Mar", type:"info", unread:false },
];

const COMPLAINTS_INIT = [
  { id:1, title:"Water leakage in bathroom", desc:"Continuous drip from the overhead shower joint since last week.", date:"28 Mar", status:"in-progress", cat:"Plumbing" },
  { id:2, title:"Broken window latch",       desc:"The window latch in my room does not close properly.", date:"20 Mar", status:"resolved",    cat:"Carpentry" },
];

const REQUESTS_INIT = [
  { id:1, title:"Extra blanket request", date:"29 Mar", status:"approved", cat:"Room" },
  { id:2, title:"WiFi password change",  date:"25 Mar", status:"pending",  cat:"IT"   },
];

const INVOICES = [
  { id:"INV-2026-03", month:"March 2026",    amount:8500, status:"paid", date:"2 Mar 2026" },
  { id:"INV-2026-02", month:"February 2026", amount:8500, status:"paid", date:"1 Feb 2026" },
  { id:"INV-2026-01", month:"January 2026",  amount:8500, status:"paid", date:"3 Jan 2026" },
  { id:"INV-2025-12", month:"December 2025", amount:8700, status:"paid", date:"2 Dec 2025" },
  { id:"INV-2025-11", month:"November 2025", amount:8700, status:"paid", date:"1 Nov 2025" },
];

const SERVICES = [
  { emoji:"🔧", label:"Plumbing"    },
  { emoji:"⚡",  label:"Electrical" },
  { emoji:"🧺",  label:"Laundry"   },
  { emoji:"🍽",  label:"Mess/Food" },
  { emoji:"📶",  label:"WiFi/IT"   },
  { emoji:"🔨",  label:"Carpentry" },
  { emoji:"🧹",  label:"Cleaning"  },
  { emoji:"🛏",  label:"Bedding"   },
];

const NAV = [
  { id:"home",          label:"Home",          icon:"home"   },
  { id:"notices",       label:"Notices",       icon:"bell",  badge:true },
  { id:"complaints",    label:"Complaints",    icon:"warn"   },
  { id:"services",      label:"Services",      icon:"wrench" },
  { id:"invoices",      label:"Invoices",      icon:"file"   },
  { id:"notice-period", label:"Notice Period", icon:"shield" },
];

/* ─── Status badge styles ─────────────────────────────────────────────────── */
const statusClass = (s) => ({
  paid:          "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pending:       "bg-amber-100   text-amber-700   border border-amber-200",
  "in-progress": "bg-blue-100   text-blue-700    border border-blue-200",
  resolved:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  approved:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected:      "bg-red-100    text-red-700     border border-red-200",
  maintenance:   "bg-orange-100 text-orange-700",
  info:          "bg-blue-100   text-blue-700",
  alert:         "bg-red-100    text-red-700",
}[s] || "bg-slate-100 text-slate-600");

/* ─── Reusable components ─────────────────────────────────────────────────── */
const Badge = ({ s }) => (
  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${statusClass(s)}`}>{s}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>{children}</div>
);

const CardHead = ({ title, right }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <span className="font-display font-bold text-slate-800 text-base">{title}</span>
    {right}
  </div>
);




/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ nav, setNav, unread, onClose }) {
  return (
    <div className="flex flex-col h-full bg-[#0f4c75] text-white">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Ic d={IC.home} size={17} stroke="white" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm leading-tight">Sunrise PG</p>
          <p className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">Resident Portal</p>
        </div>
        <button onClick={onClose} className="ml-auto bg-transparent border-none cursor-pointer text-white/40 hover:text-white transition-colors lg:hidden">
          <Ic d={IC.close} size={17} />
        </button>
      </div>

      {/* Resident card */}
      <div className="mx-3 mt-4 p-4 rounded-2xl bg-white/[0.07] border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{RESIDENT.name}</p>
            <p className="text-[11px] text-white/40 mt-0.5">Room {RESIDENT.room}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-white/40 mb-1">Floor</p>
            <p className="text-xs font-bold text-white">2nd, Block A</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 mb-1">Rent</p>
            <p className="text-xs font-bold text-teal-300">₹8,500</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Navigation</p>
        {NAV.map(item => {
          const active = nav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setNav(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all border-none cursor-pointer ${
                active
                  ? "bg-white text-[#0f4c75] shadow-md"
                  : "bg-transparent text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              <Ic d={Array.isArray(IC[item.icon]) ? IC[item.icon] : IC[item.icon]} size={17}
                stroke={active ? "#0f4c75" : "currentColor"} />
              <span>{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="ml-auto bg-teal-400 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/10 transition-all bg-transparent border-none cursor-pointer">
          <Ic d={IC.logout} size={17} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── PAGE: Home ──────────────────────────────────────────────────────────── */
function PageHome({ goNav, setModal, complaints, notices, unread, markRead }) {
  const QuickCard = ({ icon, label, sub, onClick, gradFrom, gradTo }) => (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[140px] relative overflow-hidden rounded-2xl p-4 text-left border-none cursor-pointer bg-gradient-to-br ${gradFrom} ${gradTo} hover:-translate-y-0.5 transition-transform`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
        <Ic d={IC[icon]} size={19} stroke="white" />
      </div>
      <p className="font-bold text-sm text-white">{label}</p>
      <p className="text-[11px] text-white/70 mt-1">{sub}</p>
      <div className="absolute -right-3 -bottom-3 w-14 h-14 rounded-full bg-white/10" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-br from-[#0f4c75] via-[#1b6ca8] to-[#118ab2]">
        <div className="absolute -right-5 -top-5 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-5 bottom-[-8px] w-14 h-14 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-sm text-white/70 font-medium mb-1">Good morning 👋</p>
          <h2 className="font-display text-2xl font-bold text-white mb-3">{RESIDENT.name}</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">🏠 {RESIDENT.room}</span>
            <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">{RESIDENT.floor}</span>
            <span className="bg-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">📅 Since {RESIDENT.joined}</span>
          </div>
        </div>
      </div>

      {/* Rent card */}
      <Card>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Rent Due</p>
              <p className="font-display text-3xl font-bold text-slate-800">₹{RESIDENT.rent.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Due by</p>
              <p className="text-sm font-bold text-red-500">{RESIDENT.due}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full w-[72%] bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Billing cycle: Monthly</span>
            <button onClick={() => goNav("invoices")} className="text-xs text-teal-600 font-bold bg-transparent border-none cursor-pointer hover:underline">
              View Invoices →
            </button>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <QuickCard icon="warn"   label="Raise Complaint" sub="Report an issue"    onClick={() => setModal("complaint")}     gradFrom="from-red-500"    gradTo="to-red-600" />
          <QuickCard icon="wrench" label="Request Service" sub="Maintenance & more" onClick={() => setModal("service")}       gradFrom="from-sky-500"    gradTo="to-sky-600" />
          <QuickCard icon="file"   label="My Invoices"     sub="Download receipts"  onClick={() => goNav("invoices")}          gradFrom="from-violet-500" gradTo="to-violet-600" />
          <QuickCard icon="shield" label="Notice Period"   sub="Plan your exit"     onClick={() => setModal("notice-period")}  gradFrom="from-amber-400"  gradTo="to-amber-500" />
        </div>
      </div>

      {/* Latest notices */}
      <Card>
        <CardHead title="Latest Notices" right={
          <button onClick={() => goNav("notices")} className="text-xs text-teal-600 font-bold bg-transparent border-none cursor-pointer hover:underline">View all →</button>
        } />
        <div className="divide-y divide-slate-50">
          {notices.slice(0, 3).map(n => (
            <button
              key={n.id}
              onClick={() => { markRead(n.id); goNav("notices"); }}
              className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left bg-transparent border-none cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-teal-500" : "bg-slate-200"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${n.unread ? "text-slate-800" : "text-slate-500"}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{n.body}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{n.date}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Complaints preview */}
      <Card>
        <CardHead title="My Complaints" right={
          <button
            onClick={() => setModal("complaint")}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <Ic d={IC.plus} size={12} /> New
          </button>
        } />
        <div className="divide-y divide-slate-50">
          {complaints.slice(0, 2).map(c => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Ic d={IC.warn} size={16} stroke="#94a3b8" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.cat} · {c.date}</p>
              </div>
              <Badge s={c.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE: Notices ───────────────────────────────────────────────────────── */
function PageNotices({ notices, markRead }) {
  const [open, setOpen] = useState(null);
  const unread = notices.filter(n => n.unread).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Notice Board</h2>
        <p className="text-sm text-slate-400 mt-1">{unread} unread notice{unread !== 1 ? "s" : ""}</p>
      </div>
      {notices.map(n => (
        <div
          key={n.id}
          onClick={() => { markRead(n.id); setOpen(open === n.id ? null : n.id); }}
          className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md border-2 ${n.unread ? "border-teal-200" : "border-slate-100"}`}
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-teal-500" : "bg-slate-200"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusClass(n.type)}`}>{n.type}</span>
                  <span className="text-xs text-slate-400">{n.date}</span>
                  {n.unread && <span className="bg-teal-50 text-teal-600 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                </div>
                <p className={`text-sm font-semibold ${n.unread ? "text-slate-800" : "text-slate-500"}`}>{n.title}</p>
                {open === n.id && (
                  <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">{n.body}</p>
                )}
              </div>
              <div className={`text-slate-400 shrink-0 transition-transform duration-200 ${open === n.id ? "rotate-90" : ""}`}>
                <Ic d={IC.chevR} size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PAGE: Complaints ────────────────────────────────────────────────────── */
function PageComplaints({ complaints, setModal }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">My Complaints</h2>
          <p className="text-sm text-slate-400 mt-1">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} raised</p>
        </div>
        <button
          onClick={() => setModal("complaint")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-100 hover:from-teal-700 hover:to-teal-800 transition-all border-none cursor-pointer"
        >
          <Ic d={IC.plus} size={14} /> Raise
        </button>
      </div>
      <div className="space-y-3">
        {complaints.map(c => (
          <Card key={c.id}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-slate-100 text-slate-600 font-mono text-xs font-semibold px-2 py-0.5 rounded-lg">{c.cat}</span>
                    <span className="text-xs text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{c.title}</p>
                </div>
                <Badge s={c.status} />
              </div>
              {c.desc && <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{c.desc}</p>}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <Ic d={IC.clock} size={12} stroke="#94a3b8" />
                Last updated: {c.date}
              </div>
            </div>
          </Card>
        ))}
        {complaints.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Ic d={IC.check} size={36} stroke="#94a3b8" />
            <p className="font-semibold mt-3 text-base">No complaints raised</p>
            <p className="text-sm mt-1">You're all good! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PAGE: Services ──────────────────────────────────────────────────────── */
function PageServices({ requests, setModal }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Service Requests</h2>
          <p className="text-sm text-slate-400 mt-1">Request maintenance & housekeeping</p>
        </div>
        <button
          onClick={() => setModal("service")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-100 hover:from-sky-600 hover:to-sky-700 transition-all border-none cursor-pointer"
        >
          <Ic d={IC.plus} size={14} /> Request
        </button>
      </div>

      <Card>
        <div className="p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available Services</p>
          <div className="grid grid-cols-4 gap-2">
            {SERVICES.map(s => (
              <button
                key={s.label}
                onClick={() => setModal("service")}
                className="flex flex-col items-center gap-2 py-3 px-1 rounded-xl bg-slate-50 border border-slate-100 hover:bg-teal-50 hover:border-teal-200 transition-all cursor-pointer"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="My Requests" />
        <div className="divide-y divide-slate-50">
          {requests.map(r => (
            <div key={r.id} className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <Ic d={IC.wrench} size={18} stroke="#0d9488" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.cat} · {r.date}</p>
              </div>
              <Badge s={r.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE: Invoices ──────────────────────────────────────────────────────── */
function PageInvoices() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Invoices & Receipts</h2>
        <p className="text-sm text-slate-400 mt-1">Download your monthly rent receipts</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
          <p className="font-display text-xl font-bold text-emerald-700">₹44,900</p>
          <p className="text-xs text-emerald-600 opacity-70 font-semibold mt-1">Total Paid</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
          <p className="font-display text-xl font-bold text-blue-700">₹8,500</p>
          <p className="text-xs text-blue-600 opacity-70 font-semibold mt-1">This Month</p>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
          <p className="font-display text-xl font-bold text-violet-700">{INVOICES.length}</p>
          <p className="text-xs text-violet-600 opacity-70 font-semibold mt-1">Invoices</p>
        </div>
      </div>

      <Card>
        <CardHead title="Payment History" />
        <div className="divide-y divide-slate-50">
          {INVOICES.map(inv => (
            <div key={inv.id} className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <Ic d={IC.file} size={18} stroke="#7c3aed" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{inv.month}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{inv.id} · Paid {inv.date}</p>
              </div>
              <div className="text-right mr-2 shrink-0">
                <p className="text-sm font-bold text-slate-800">₹{inv.amount.toLocaleString("en-IN")}</p>
                <Badge s={inv.status} />
              </div>
              <button className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-teal-100 hover:text-teal-700 flex items-center justify-center text-slate-500 transition-colors border-none cursor-pointer shrink-0">
                <Ic d={IC.dl} size={15} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE: Notice Period ─────────────────────────────────────────────────── */
function PageNoticePeriod({ noticePeriod, setModal }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Notice Period</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your vacating notice</p>
      </div>

      {/* Status */}
      <div className={`rounded-2xl p-6 text-center border-2 shadow-sm ${noticePeriod ? "bg-amber-50 border-amber-300" : "bg-white border-slate-100"}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${noticePeriod ? "bg-amber-100" : "bg-slate-100"}`}>
          <Ic d={IC.shield} size={28} stroke={noticePeriod ? "#d97706" : "#94a3b8"} />
        </div>
        {noticePeriod ? (
          <>
            <p className="font-display text-lg font-bold text-amber-700">Notice Period Active</p>
            <p className="text-sm text-amber-600 mt-1">Vacating date set to</p>
            <div className="bg-amber-100 border border-amber-200 rounded-xl p-3 mt-3 inline-block">
              <p className="font-display text-xl font-bold text-amber-800">{noticePeriod}</p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Contact your warden to modify or withdraw.</p>
          </>
        ) : (
          <>
            <p className="font-display text-lg font-bold text-slate-700">No Active Notice</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">You haven't served a notice period yet.</p>
            <button
              onClick={() => setModal("notice-period")}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-amber-100 hover:from-amber-600 hover:to-amber-700 transition-all border-none cursor-pointer"
            >
              Serve Notice Period
            </button>
          </>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Ic d={IC.clock} size={18} stroke="#1e40af" />
          <p className="text-[10px] text-blue-600 opacity-70 font-bold uppercase tracking-wide mt-2 mb-1">Duration</p>
          <p className="text-sm font-bold text-blue-700">30 Days</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <Ic d={IC.cal} size={18} stroke="#166534" />
          <p className="text-[10px] text-emerald-600 opacity-70 font-bold uppercase tracking-wide mt-2 mb-1">Joined</p>
          <p className="text-sm font-bold text-emerald-700">{RESIDENT.joined}</p>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
          <Ic d={IC.shield} size={18} stroke="#5b21b6" />
          <p className="text-[10px] text-violet-600 opacity-70 font-bold uppercase tracking-wide mt-2 mb-1">Deposit</p>
          <p className="text-sm font-bold text-violet-700">₹17,000</p>
        </div>
      </div>

      {/* Process */}
      <Card>
        <CardHead title="Vacating Process" />
        <div className="p-5 space-y-4">
          {[
            { step:"01", title:"Submit Notice",   desc:"Fill in your planned vacating date",                   color:"bg-teal-500"   },
            { step:"02", title:"Warden Approval", desc:"Warden reviews and confirms your notice period start", color:"bg-blue-500"   },
            { step:"03", title:"Room Inspection", desc:"Inspection scheduled 2 days before vacating",          color:"bg-amber-500"  },
            { step:"04", title:"Deposit Refund",  desc:"Security deposit refunded within 7 working days",     color:"bg-violet-500" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full ${s.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                {s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function ResidentDashboard() {
  const [nav,         setNav]         = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal,       setModal]       = useState(null);
  const [complaints,  setComplaints]  = useState(COMPLAINTS_INIT);
  const [requests,    setRequests]    = useState(REQUESTS_INIT);
  const [notices,     setNotices]     = useState(NOTICES_INIT);
  const [noticePeriod,setNP]          = useState(null);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const unread  = notices.filter(n => n.unread).length;
  const markRead = id => setNotices(n => n.map(x => x.id === id ? { ...x, unread: false } : x));
  const goNav    = id => { setNav(id); setSidebarOpen(false); };

  const pageProps = { goNav, setModal, complaints, requests, notices, unread, markRead, noticePeriod };

  const pages = {
    home:           <PageHome          {...pageProps} />,
    notices:        <PageNotices       notices={notices} markRead={markRead} />,
    complaints:     <PageComplaints    complaints={complaints} setModal={setModal} />,
    services:       <PageServices      requests={requests}    setModal={setModal} />,
    invoices:       <PageInvoices />,
    "notice-period":<PageNoticePeriod  noticePeriod={noticePeriod} setModal={setModal} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .page-enter { animation: fadeUp 0.4s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-slate-50">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <Sidebar nav={nav} setNav={goNav} unread={unread} onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Topbar */}
          <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm z-10 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border-none cursor-pointer"
            >
              <Ic d={IC.menu} size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-slate-800 text-sm truncate">
                {NAV.find(n => n.id === nav)?.label || "Dashboard"}
              </p>
              <p className="text-xs text-slate-400 truncate hidden sm:block">{RESIDENT.pg} · {RESIDENT.addr}</p>
            </div>
            <button
              onClick={() => setModal("complaint")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-xl text-xs font-bold transition-colors border-none cursor-pointer"
            >
              <Ic d={IC.warn} size={13} /> Raise Issue
            </button>
            <button
              onClick={() => goNav("notices")}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border-none cursor-pointer"
            >
              <Ic d={IC.bell} size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer shrink-0">
              RS
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
            <div className={`w-[90%] mx-auto transition-opacity duration-300 ${mounted ? "opacity-100 page-enter" : "opacity-0"}`}>
              {pages[nav] || pages.home}
            </div>
          </main>

          {/* Mobile bottom nav */}
          <nav className="lg:hidden bg-white border-t border-slate-100 flex items-center justify-around px-2 py-2 shadow-lg shrink-0">
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goNav(item.id)}
                  className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl border-none bg-transparent cursor-pointer"
                >
                  <Ic
                    d={Array.isArray(IC[item.icon]) ? IC[item.icon] : IC[item.icon]}
                    size={21}
                    stroke={active ? "#0f4c75" : "#94a3b8"}
                  />
                  <span className={`text-[9px] font-bold ${active ? "text-[#0f4c75]" : "text-slate-400"}`}>
                    {item.label.split(" ")[0]}
                  </span>
                  {item.badge && unread > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                  {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0f4c75] rounded-full" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Modals */}
      {modal === "complaint"      && <ComplaintModal     onClose={() => setModal(null)} onSubmit={c => setComplaints(p => [c, ...p])} />}
      {modal === "service"        && <ServiceModal       onClose={() => setModal(null)} onSubmit={r => setRequests(p => [r, ...p])} />}
      {modal === "notice-period"  && <NoticePeriodModal  onClose={() => setModal(null)} active={noticePeriod} onActivate={d => setNP(d)} />}
    </>
  );
}