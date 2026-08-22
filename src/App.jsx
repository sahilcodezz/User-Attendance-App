import React from 'react'
import{Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import Users from './pages/Users'
import UserDetails from './pages/UserDetails'
import AddUser from './pages/AddUser'
import Login from './pages/Login'
import Navbar from './component/Navbar'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar>
      <Routes>
        <Route path="/" element={<Home />}/>
         <Route path="/users" element={<Users />}/>
          <Route
          path="/users/:id"
          element={<UserDetails />}
        />

        <Route
          path="/add-user"
          element={<AddUser />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </Navbar>
    </BrowserRouter>
    
  )
}

export default App