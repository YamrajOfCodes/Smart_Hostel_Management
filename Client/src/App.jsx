import React from 'react'
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard'
import {Routes,Route} from "react-router-dom"
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import ResidentDashboard from './Pages/Resident/Residentdashboard'
import HostelOverview from './Pages/Admin/HostelOverview/HostelOverview'

const App = () => {
  return (
    <div>
    <Routes>
     <Route path='/' element={<Login/>}/>  
     <Route path='/admin' element={<HostelOverview/>}/>
     <Route path='/admin/hostels/:id' element={<AdminDashboard/>}/>  
     <Route path='/student' element={<ResidentDashboard/>}/>  
     <Route path='/superadmin' element={<SuperAdminDashboard/>}/>  
    
    </Routes>      
    </div>
  )
}

export default App
