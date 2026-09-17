import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import Users from './pages/Users'
import UserDetails from './pages/UserDetails'
import AddUser from './pages/AddUser'
import Login from './pages/Login'
import Navbar from './component/Navbar'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import AttendanceHistory from './pages/AttendanceHistory'
import Leave from './pages/Leave'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance-history" element={<AttendanceHistory />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App