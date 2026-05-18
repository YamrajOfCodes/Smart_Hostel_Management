import React from 'react'
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard'
import {Routes,Route} from "react-router-dom"
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import ResidentDashboard from './Pages/Resident/Residentdashboard'

const App = () => {
  return (
    <div>
    <Routes>
     <Route path='/' element={<Login/>}/>  
     <Route path='/admin' element={<AdminDashboard/>}/>  
     <Route path='/student' element={<ResidentDashboard/>}/>  
    
    </Routes>      
    </div>
  )
}

export default App
