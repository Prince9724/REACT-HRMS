
import React from 'react'
import Home from './components/Home'
import { Route, Routes } from 'react-router'
import Login from './pages/login/Login'
import Hrlogin from './screen/login-page/Hrlogin'
import Hr from './screen/hr/Hr'
import Add from './screen/hr/add/Add'
import Employees from './pages/employees/Employees'
import Profile from './pages/profile/Profile'
import HrDashboard from './pages/dashboard/HrDashboard'
import View from './pages/view/View'
import Manager from './screen/Manager/Manager'

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hrlogin' element={<Hrlogin/>}/>
        <Route path='/hr' element={<Hr/>}/>
        <Route path='/Manager' element={<Manager/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/user' element={<Employees />}/>
        <Route path='/profile' element ={<Profile/>}/>
        <Route path='/hrdashboard' element={<HrDashboard/>}/>
        <Route path='/view' element={<View/>}/>
      </Routes>

    </div>
  )
}

export default App