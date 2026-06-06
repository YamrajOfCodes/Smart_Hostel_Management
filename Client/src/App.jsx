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
import Dashboard from "./Pages/Admin/SubPages/Dashboard/Dashboard";
import RoomManagement from "./Pages/Admin/SubPages/Room_Management/RoomManagement";
import ResidentsSection from "./Pages/Admin/SubPages/Residents/Residents";
import RentRecords from "./Pages/Admin/SubPages/Payment/RentPayments";
import HostelNotices from "./Pages/Admin/SubPages/Notice/HostelNotices";
import ResidentHome from "./Pages/Resident/SubPages/ResidentOverView/ResidentOverView";
import PageNotices from "./Pages/Resident/SubPages/Notices/Notices";
import PageComplaints from "./Pages/Resident/SubPages/Complaints/Complaints";
import PageAdminComplaints from "./Pages/Admin/SubPages/Complaints/Complaints";

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />



      {/* Admin Routes */}
      <Route path="/admin" element={<HostelOverview />}/>
        
      <Route path="admin/hostels/:id" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="residents" element={<ResidentsSection />} />
        <Route path="rent" element={<RentRecords />} />
        <Route path="complaints" element={<PageAdminComplaints/>} />
        <Route path="notices" element={<HostelNotices/>} />
      </Route>




      {/* Resident Routes */}
      <Route path="/resident" element={<ResidentDashboard />} >
      <Route index element={<ResidentHome />} />
      <Route path="notices" element={<PageNotices/>}/>
      <Route path="complaints" element={<PageComplaints/>}/>

      </Route>
      

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