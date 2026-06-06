import { useState } from "react";
import { usegetComplaints } from "../../../../hooks/UserHooks/complaintHooks";
import { useParams } from "react-router-dom";

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
  plus:   ["M12 5v14", "M5 12h14"],
  clock:  ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
  check:  "M20 6L9 17l-5-5",
  search: ["M11 17a6 6 0 100-12 6 6 0 000 12z", "M21 21l-4.35-4.35"],
  dl:     ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  tag:    ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z", "M7 7h.01"],
  door:   ["M3 3h18v18H3z", "M9 3v18"],
};

const statusClass = (s) => ({
  pending:       "bg-amber-100 text-amber-800 border border-amber-200",
  "in-progress": "bg-blue-100 text-blue-800 border border-blue-200",
  resolved:      "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rejected:      "bg-red-100 text-red-800 border border-red-200",
}[s] || "bg-slate-100 text-slate-600 border border-slate-200");

const MOCK_COMPLAINTS = [
  { id: 1, issueTitle: "Water leakage in bathroom",  details: "Continuous drip from the overhead shower joint since last week. Causing water damage to the floor.", date: "28 Mar 2025", status: "in-progress", category: "Plumbing",     resident: "Arjun Mehta",   room: "A-204", initials: "AM" },
  { id: 2, issueTitle: "Broken window latch",         details: "The window latch in the room does not close properly, causing a security concern.",                  date: "20 Mar 2025", status: "resolved",    category: "Carpentry",    resident: "Priya Sharma",  room: "B-102", initials: "PS" },
  { id: 3, issueTitle: "No hot water in shower",      details: "Hot water has not been available for the past 3 days. Affects entire B-block.",                     date: "1 Apr 2025",  status: "pending",     category: "Plumbing",     resident: "Rohit Nair",    room: "B-308", initials: "RN" },
  { id: 4, issueTitle: "Electrical socket sparking",  details: "The socket near the study table is sparking when plugging in devices. Immediate attention needed.",   date: "3 Apr 2025",  status: "pending",     category: "Electrical",   resident: "Sneha Kapoor",  room: "C-110", initials: "SK" },
  { id: 5, issueTitle: "Pest infestation in kitchen", details: "Cockroaches spotted near the common kitchen area multiple times this week.",                         date: "30 Mar 2025", status: "in-progress", category: "Pest Control", resident: "Dev Patel",     room: "A-301", initials: "DP" },
  { id: 6, issueTitle: "AC not cooling properly",     details: "Air conditioning unit is running but not bringing temperature below 28°C even on max settings.",     date: "25 Mar 2025", status: "rejected",    category: "HVAC",         resident: "Meera Iyer",    room: "D-207", initials: "MI" },
];

const FILTERS = ["all", "pending", "in-progress", "resolved", "rejected"];

const Avatar = ({ initials }) => (
  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-semibold shrink-0">
    {initials}
  </div>
);

const Badge = ({ s }) => (
  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 capitalize ${statusClass(s)}`}>{s}</span>
);

const StatCard = ({ label, value, valueClass = "" }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">{label}</p>
    <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
  </div>
);

function PageAdminComplaints() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const {id} = useParams();
   const {data:complaintss} = usegetComplaints(id);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const updateStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast("Status updated");
  };

  const filtered = complaints.filter(c => {
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.issueTitle.toLowerCase().includes(q) ||
      c.resident.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const count = (s) => complaints.filter(c => c.status === s).length;

  return (
    <div className="space-y-5 relative">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Complaints</h2>
          <p className="text-sm text-slate-400 mt-1">
            {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} · Hostel Block A–D
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all border-none cursor-pointer">
          <Ic d={IC.dl} size={14} stroke="white" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total"       value={complaints.length}  valueClass="text-slate-800" />
        <StatCard label="Pending"     value={count("pending")}     valueClass="text-amber-600" />
        <StatCard label="In progress" value={count("in-progress")} valueClass="text-blue-600" />
        <StatCard label="Resolved"    value={count("resolved")}    valueClass="text-emerald-600" />
        <StatCard label="Rejected"    value={count("rejected")}    valueClass="text-red-600" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer capitalize ${
              activeFilter === f
                ? "bg-slate-800 text-white border-transparent"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-white">
          <Ic d={IC.search} size={14} stroke="#94a3b8" />
          <input
            type="text"
            placeholder="Search complaints…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm outline-none bg-transparent text-slate-700 placeholder-slate-400 w-40"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-slate-200 transition-all">

            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="bg-slate-100 text-slate-600 font-mono text-xs font-semibold px-2 py-0.5 rounded-lg">
                    {c.category}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-lg">
                    {c.room}
                  </span>
                  <span className="text-xs text-slate-400">{c.date}</span>
                </div>
                <p className="text-sm font-bold text-slate-800">{c.issueTitle}</p>
              </div>
              <Badge s={c.status} />
            </div>

            {/* Description */}
            {c.details && (
              <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                {c.details}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 flex-wrap">
              <div className="flex items-center gap-2">
                <Avatar initials={c.initials} />
                <span className="text-xs text-slate-500">{c.resident}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ic d={IC.clock} size={12} stroke="#94a3b8" />
                <span className="text-xs text-slate-400">Last updated: {c.date}</span>
                <select
                  value={c.status}
                  onChange={e => updateStatus(c.id, e.target.value)}
                  className="ml-2 text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 cursor-pointer outline-none hover:border-slate-400 transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Ic d={IC.check} size={36} stroke="#94a3b8" />
            <p className="font-semibold mt-3 text-base">No complaints found</p>
            <p className="text-sm mt-1">Try a different filter or search term.</p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

export default PageAdminComplaints;