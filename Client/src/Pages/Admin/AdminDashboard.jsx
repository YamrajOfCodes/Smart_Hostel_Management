import { useState, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
// data
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75", "M9 7a4 4 0 100 8 4 4 0 000-8z"],
  bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  rooms: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  money: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  complaint: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  plus: "M12 5v14 M5 12h14",
  search: ["M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z", "M16 16l4.5 4.5"],
  chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  check: "M20 6L9 17l-5-5",
  dot: "M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0",
  send: "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
  key: ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const complaints = [
  { id: 1, name: "Rahul Sharma", room: "A-204", issue: "Water leakage in bathroom", date: "28 Mar", status: "pending", priority: "high" },
  { id: 2, name: "Priya Patel", room: "B-110", issue: "AC not working properly", date: "27 Mar", status: "in-progress", priority: "medium" },
  { id: 3, name: "Amit Kumar", room: "C-305", issue: "Broken window latch", date: "26 Mar", status: "resolved", priority: "low" },
  { id: 4, name: "Sneha Joshi", room: "A-108", issue: "WiFi connectivity issues", date: "25 Mar", status: "pending", priority: "medium" },
  { id: 5, name: "Vikram Singh", room: "D-212", issue: "Lights flickering", date: "24 Mar", status: "in-progress", priority: "high" },
];

const rentData = [
  { name: "Aisha Khan", room: "A-201", amount: 8500, due: "Apr 05", status: "upcoming" },
  { name: "Ravi Verma", room: "B-305", amount: 9200, due: "Apr 03", status: "due-soon" },
  { name: "Meera Iyer", room: "C-112", amount: 7800, due: "Apr 01", status: "overdue" },
  { name: "Karan Mehta", room: "D-408", amount: 10500, due: "Apr 07", status: "upcoming" },
  { name: "Divya Nair", room: "A-316", amount: 8900, due: "Mar 30", status: "overdue" },
];

const recentUsers = [
  { name: "Rohan Das", room: "E-201", joined: "30 Mar", floor: "2nd", avatar: "RD" },
  { name: "Ananya Roy", room: "B-404", joined: "29 Mar", floor: "4th", avatar: "AR" },
  { name: "Suresh Pillai", room: "C-103", joined: "28 Mar", floor: "1st", avatar: "SP" },
  { name: "Neha Gupta", room: "A-302", joined: "27 Mar", floor: "3rd", avatar: "NG" },
];

const notices = [
  { id: 1, title: "Water Supply Maintenance", body: "Water will be shut off on Apr 3rd from 10am–2pm for annual maintenance.", date: "30 Mar", type: "maintenance" },
  { id: 2, title: "Mess Menu Update", body: "New mess menu effective from April 1st. Special Sunday brunch added.", date: "28 Mar", type: "info" },
  { id: 3, title: "Rent Due Reminder", body: "Monthly rent for April is due by April 5th. Late fees apply after 7th.", date: "27 Mar", type: "alert" },
];

const roomFloors = [
  { floor: "Floor A", total: 40, occupied: 36, maintenance: 2 },
  { floor: "Floor B", total: 40, occupied: 31, maintenance: 1 },
  { floor: "Floor C", total: 35, occupied: 29, maintenance: 3 },
  { floor: "Floor D", total: 30, occupied: 24, maintenance: 0 },
  { floor: "Floor E", total: 25, occupied: 18, maintenance: 2 },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "rooms", label: "Room Management", icon: "rooms" },
  { id: "users", label: "Residents", icon: "users" },
  { id: "rent", label: "Rent & Payments", icon: "money" },
  { id: "complaints", label: "Complaints", icon: "complaint" },
  { id: "notices", label: "Notices", icon: "bell" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    upcoming: "bg-slate-100 text-slate-600 border-slate-200",
    "due-soon": "bg-amber-100 text-amber-700 border-amber-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
    maintenance: "bg-orange-100 text-orange-700",
    info: "bg-blue-100 text-blue-700",
    alert: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

const priorityDot = (p) => ({ high: "bg-red-500", medium: "bg-amber-400", low: "bg-emerald-400" }[p] || "bg-slate-400");

const avatarColor = (str) => {
  const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500","bg-indigo-500","bg-pink-500"];
  let h = 0; for (let c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
  return colors[h % colors.length];
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, delay = 0 }) {
  const accents = {
    blue: { bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-600", bar: "bg-blue-500" },
    amber: { bg: "bg-amber-50", iconBg: "bg-amber-500", text: "text-amber-600", bar: "bg-amber-500" },
    emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-600", bar: "bg-emerald-500" },
    rose: { bg: "bg-rose-50", iconBg: "bg-rose-500", text: "text-rose-600", bar: "bg-rose-500" },
    violet: { bg: "bg-violet-50", iconBg: "bg-violet-600", text: "text-violet-600", bar: "bg-violet-500" },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-fadeUp`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${a.iconBg} flex items-center justify-center text-white`}>
          <Icon d={Icons[icon]} size={20} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${a.bg} ${a.text}`}>{sub}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800 font-display">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${a.bar} rounded-full`} style={{ width: "65%" }} />
      </div>
    </div>
  );
}

// ─── Room Visual ──────────────────────────────────────────────────────────────
function RoomBar({ floor, total, occupied, maintenance }) {
  const available = total - occupied - maintenance;
  const occPct = (occupied / total) * 100;
  const mainPct = (maintenance / total) * 100;
  const availPct = (available / total) * 100;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">{floor}</span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="text-emerald-600 font-semibold">{available} free</span>
          <span>{occupied}/{total}</span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
        <div className="bg-blue-500 h-full transition-all duration-700" style={{ width: `${occPct}%` }} title={`Occupied: ${occupied}`} />
        <div className="bg-amber-400 h-full transition-all duration-700" style={{ width: `${mainPct}%` }} title={`Maintenance: ${maintenance}`} />
        <div className="bg-emerald-400 h-full transition-all duration-700" style={{ width: `${availPct}%` }} title={`Available: ${available}`} />
      </div>
    </div>
  );
}

// ─── Notice Modal ─────────────────────────────────────────────────────────────
function NoticeModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("info");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAdd({ id: Date.now(), title, body, date: "Today", type });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-slate-800">Post Announcement</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <Icon d={Icons.close} size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
              placeholder="Announcement title…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all resize-none"
              placeholder="Write your announcement here…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
            <div className="flex gap-2">
              {["info","maintenance","alert"].map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${type === t ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-200"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300">
            <Icon d={Icons.send} size={15} />
            Post Announcement
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", room: "", phone: "", floor: "A" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-slate-800">Add New Resident</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <Icon d={Icons.close} size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {[["name","Full Name","Resident name"],["email","Email","email@domain.com"],["room","Room No.","A-201"],["phone","Phone","9876543210"]].map(([k,l,p]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{l}</label>
              <input value={form[k]} onChange={e => set(k, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                placeholder={p} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Floor Block</label>
            <div className="flex gap-2">
              {["A","B","C","D","E"].map(f => (
                <button key={f} type="button" onClick={() => set("floor", f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${form.floor === f ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 mt-2">
            <Icon d={Icons.plus} size={15} />
            Add Resident
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-display font-bold text-slate-800 text-base">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [noticeList, setNoticeList] = useState(notices);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const addNotice = (n) => setNoticeList(prev => [n, ...prev]);

  const totalRooms = roomFloors.reduce((a, f) => a + f.total, 0);
  const totalOccupied = roomFloors.reduce((a, f) => a + f.occupied, 0);
  const totalMaint = roomFloors.reduce((a, f) => a + f.maintenance, 0);
  const totalAvail = totalRooms - totalOccupied - totalMaint;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .font-display { font-family: 'Playfair Display', serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.95); }
          to   { opacity:1; transform:scale(1); }
        }
        .animate-fadeUp { animation: fadeUp 0.5s ease both; }
        .animate-scaleIn { animation: scaleIn 0.25s ease both; }
        .sidebar-link { transition: all 0.18s ease; }
        .sidebar-link:hover { background: rgba(59,130,246,0.08); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dot-bg {
          background-image: radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

        {/* ── SIDEBAR ────────────────────────────────── */}
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 flex flex-col bg-[#0e1e34] text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex-shrink-0
        `}>
          {/* Sidebar header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/30">
              <Icon d={Icons.home} size={17} />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">StayNest HMS</p>
              <p className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">Admin Portal</p>
            </div>
            <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <Icon d={Icons.close} size={18} />
            </button>
          </div>

          {/* PG Name banner */}
          <div className="mx-4 mt-4 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.07]">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">Property</p>
            <p className="text-sm font-semibold text-white leading-tight">Sunrise PG & Hostel</p>
            <p className="text-xs text-white/40 mt-0.5">Pune, Maharashtra</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2 mt-1">Menu</p>
            {navItems.map(item => {
              const active = activeNav === item.id;
              return (
                <button key={item.id}
                  onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                  className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : "text-white/60 hover:text-white"
                  }`}>
                  <span className={active ? "text-white" : "text-white/50"}>
                    <Icon d={Array.isArray(Icons[item.icon]) ? Icons[item.icon] : Icons[item.icon]} size={17} />
                  </span>
                  {item.label}
                  {item.id === "complaints" && (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {complaints.filter(c => c.status === "pending").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin profile */}
          <div className="px-4 pb-5 pt-3 border-t border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-white/40 truncate">admin@staynest.in</p>
              </div>
              <button className="ml-auto text-white/30 hover:text-white/70 transition-colors flex-shrink-0">
                <Icon d={Icons.logout} size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN AREA ──────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── TOPBAR ── */}
          <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3.5 flex items-center gap-3 flex-shrink-0 shadow-sm z-10">
            <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <Icon d={Icons.menu} size={20} />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-sm hidden sm:block">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon d={Icons.search[0]} size={15} />
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search residents, rooms…"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShowNoticeModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold transition-all">
                <Icon d={Icons.bell} size={15} />
                <span className="hidden sm:inline">Post Notice</span>
              </button>
              <button onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-200">
                <Icon d={Icons.plus} size={15} />
                <span className="hidden sm:inline">Add Resident</span>
              </button>
              {/* Notification dot */}
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">
                <Icon d={Icons.bell} size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </div>
            </div>
          </header>

          {/* ── CONTENT ── */}
          <main className="flex-1 overflow-y-auto dot-bg p-4 lg:p-6">
            <div className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>

              {/* Page title */}
              <div className="mb-6 animate-fadeUp">
                <h1 className="font-display text-2xl font-bold text-slate-800">Good morning, Admin 👋</h1>
                <p className="text-sm text-slate-500 mt-1">Here's what's happening at Sunrise PG today — Wednesday, April 01, 2026</p>
              </div>

              {/* ── STAT CARDS ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                <StatCard label="Total Residents" value={totalOccupied} sub="Active" icon="users" accent="blue" delay={0} />
                <StatCard label="Available Rooms" value={totalAvail} sub="Vacant" icon="rooms" accent="emerald" delay={80} />
                <StatCard label="Rent Due This Month" value="₹2.4L" sub="Pending" icon="money" accent="amber" delay={160} />
                <StatCard label="Open Complaints" value={complaints.filter(c=>c.status!=="resolved").length} sub="Active" icon="complaint" accent="rose" delay={240} />
              </div>

              {/* ── ROW 2: Rooms + Complaints ── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">

                {/* Room Availability */}
                <Section title="Room Availability" action={
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Occupied</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Maint.</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />Free</span>
                  </div>
                }>
                  {/* Summary chips */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label:"Total Rooms", val: totalRooms, cls:"bg-slate-50 text-slate-700 border-slate-200" },
                      { label:"Occupied", val: totalOccupied, cls:"bg-blue-50 text-blue-700 border-blue-100" },
                      { label:"Available", val: totalAvail, cls:"bg-emerald-50 text-emerald-700 border-emerald-100" },
                    ].map(c => (
                      <div key={c.label} className={`border rounded-xl px-3 py-2.5 text-center ${c.cls}`}>
                        <p className="text-xl font-bold font-display">{c.val}</p>
                        <p className="text-xs mt-0.5 opacity-70 font-medium">{c.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {roomFloors.map(f => <RoomBar key={f.floor} {...f} />)}
                  </div>
                </Section>

                {/* Complaints */}
                <Section title="Recent Complaints" action={
                  <span className="text-xs bg-rose-50 text-rose-600 font-semibold px-2.5 py-1 rounded-lg border border-rose-100">
                    {complaints.filter(c=>c.status==="pending").length} pending
                  </span>
                }>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {complaints.map(c => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityDot(c.priority)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{c.room}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.issue}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(c.status)}`}>
                            {c.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">{c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              {/* ── ROW 3: Rent + Users ── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">

                {/* Upcoming Rents */}
                <Section title="Rent & Payments" action={
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-rose-50 text-rose-600 font-semibold px-2.5 py-1 rounded-lg border border-rose-100">
                      {rentData.filter(r=>r.status==="overdue").length} overdue
                    </span>
                  </div>
                }>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {rentData.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 text-white ${avatarColor(r.name)}`}>
                          {r.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{r.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{r.room} · Due {r.due}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-800">₹{r.amount.toLocaleString("en-IN")}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(r.status)}`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Total pending</span>
                    <span className="text-sm font-bold text-slate-800">
                      ₹{rentData.filter(r=>r.status!=="paid").reduce((a,r)=>a+r.amount,0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </Section>

                {/* Recent Residents */}
                <Section title="Recently Added Residents" action={
                  <button onClick={() => setShowUserModal(true)}
                    className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
                    <Icon d={Icons.plus} size={12} /> Add New
                  </button>
                }>
                  <div className="space-y-3">
                    {recentUsers.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${avatarColor(u.name)}`}>
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{u.room} · {u.floor} Floor</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-500">Joined</p>
                          <p className="text-xs font-semibold text-slate-700">{u.joined}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                            <Icon d={Icons.eye} size={13} />
                          </button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-400 transition-colors">
                            <Icon d={Icons.trash} size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              {/* ── ROW 4: Notices ── */}
              <Section title="Notice Board & Announcements" action={
                <button onClick={() => setShowNoticeModal(true)}
                  className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5">
                  <Icon d={Icons.plus} size={12} />
                  Post Notice
                </button>
              }>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {noticeList.map(n => (
                    <div key={n.id}
                      className="relative p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group bg-slate-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadge(n.type)}`}>
                          {n.type}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500">
                          <Icon d={Icons.trash} size={13} />
                        </button>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{n.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.body}</p>
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400">{n.date}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                          <Icon d={Icons.users[0]} size={11} />
                          <span>All residents</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

            </div>
          </main>
        </div>
      </div>

      {/* ── MODALS ── */}
      {showNoticeModal && <NoticeModal onClose={() => setShowNoticeModal(false)} onAdd={addNotice} />}
      {showUserModal && <AddUserModal onClose={() => setShowUserModal(false)} />}
    </>
  );
}