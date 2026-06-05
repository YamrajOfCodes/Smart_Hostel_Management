import { NavLink, Outlet, useParams } from "react-router-dom";
import Icon from "../../components/Reusable/Icons";
import { useState } from "react";
import { useLogout } from "../../hooks/authHooks/authHooks";

export default function AdminDashboard() {
  const {id} = useParams();
  const {mutate:logout} = useLogout();

  const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home", path:`/admin/hostels/${id}` },
  { id: "rooms", label: "Room Management", icon: "rooms", path:`/admin/hostels/${id}/rooms` },
  { id: "users", label: "Residents", icon: "users", path:`/admin/hostels/${id}/residents` },
  { id: "rent", label: "Rent & Payments", icon: "money", path:`/admin/hostels/${id}/rent` },
  { id: "complaints", label: "Complaints", icon: "complaint", path:`/admin/hostels/${id}/complaints` },
  { id: "notices", label: "Notices", icon: "bell", path:`/admin/hostels/${id}/notices` },
];


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

const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");


  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      <aside>
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
                <NavLink key={item.id}
                  to={item.path}
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
                      {/* {complaints.filter(c => c.status === "pending").length} */}
                    </span>
                  )}
                </NavLink>
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
              <button className="ml-auto text-white/30 hover:text-white/70 transition-colors flex-shrink-0" onClick={()=>{logout()}}>
                <Icon d={Icons.logout} size={16} />
              </button>
            </div>
          </div>
        </aside>
  
      </div>
      </aside>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}