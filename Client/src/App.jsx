import React from 'react'
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard'
import {Routes,Route} from "react-router-dom"
import Login from './Pages/Login/Login'

const App = () => {
  return (
    <div>
    <Routes>
     <Route path='/' element={<Login/>}/>  
    
    </Routes>      
    </div>
  )
}

export default App
