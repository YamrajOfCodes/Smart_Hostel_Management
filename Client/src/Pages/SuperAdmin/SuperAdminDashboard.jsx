import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import RegisterAdminModal from "../../components/Models/RegisterAdminModal";
import { useLogout, useRegister } from "../../hooks/authHooks/authHooks";
import { protectRoute } from "../../utils/ProtectedRoutes/ProtectedRoutes";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/Reusable/Table";
import {LogOut} from "lucide-react"

const SuperAdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navigate = useNavigate();
  const {mutate:registerUser} = useRegister();
  const location = useLocation();
  const {mutate: logout} = useLogout();


  useEffect(()=>{
   const path = location.pathname.split("/")[2];
   setActiveNav(path);
  },[])

  // console.log(location.pathname)


  useEffect(()=>{
     protectRoute(navigate, 'superadmin');
  },[]);



  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      nav:"/superadmin"
    },
    {
      label: "Hostels",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      nav:"/superadmin/hostels"
    },
    {
      label: "Admins",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      nav:"/superadmin/admins"
    },
    {
      label: "Users",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      nav:"/superadmin/users"
    },
  ];



  const addHostel = (data)=>{
    registerUser(data);
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-violet-500/25 shrink-0">
              SA
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Super Admin</p>
              <p className="text-xs text-slate-500">Management Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
          {navItems.map((item) => (
            <Link to={item.nav} key={item.label}>
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label.toLowerCase()); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${activeNav === item.label.toLowerCase()
                  ? "bg-violet-600/15 text-violet-400 border border-violet-500/25"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                }`}
            >
              {item.icon}
              {item.label}
              {activeNav === item.label && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </button>
            </Link>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@hostelms.com</p>
            </div>
           <LogOut className="cursor-pointer" onClick={()=>{logout()}}/>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
      

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <Outlet/>
        </main>
      </div>


      {showModal && (
        <RegisterAdminModal
        setShowModal={setShowModal}
        addHostel={addHostel}
        />
      )}

    </div>
  );
};

export default SuperAdminDashboard;