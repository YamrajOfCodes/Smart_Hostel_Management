import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Pages/Login/Login";

// Super Admin
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard";
import DashboardHome from "./Pages/SuperAdmin/SubPages/Home/DashboardHome";
import HostelsOwners from "./Pages/SuperAdmin/SubPages/HostelsOwners/HostelsOwners";

// Admin
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import HostelOverview from "./Pages/Admin/HostelOverview/HostelOverview";

// Resident
import ResidentDashboard from "./Pages/Resident/Residentdashboard";

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />



      {/* Admin Routes */}
      <Route path="/admin" element={<HostelOverview />}/>
        
       <Route path="admin/hostels/:id" element={<AdminDashboard />} />
     



      {/* Student Routes */}
      <Route path="/student" element={<ResidentDashboard />} />
      

      {/* Super Admin Routes */}
      <Route path="/superadmin" element={<SuperAdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="admins" element={<HostelsOwners />} />
        {/* <Route path="hostels" element={<Hostels />} /> */}
        {/* <Route path="users" element={<Users />} /> */}
      </Route>

    </Routes>
  );
};

export default App;