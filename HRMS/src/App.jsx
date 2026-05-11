
import React from 'react'
import Home from './components/Home'
import { Route, Routes } from 'react-router'
import Login from './pages/login/Login'
import Hrlogin from './screen/login-page/Hrlogin'
import Hr from './screen/hr/Hr'
import Add from './screen/hr/add/Add'
import Employees from './pages/employees/Employees' 
import Profile from './pages/profile/Profile'
import HrDashboard from './screen/hr/Leave'
 
import Manager from './screen/Manager/Manager'
import ViewEmployee from './pages/employees/VeiwEmploye'
import Attendance from './screen/hr/attendence/Attendence'
import Payroll from './screen/hr/payroll/Payroll'
import SalaryHistory from './components/sallery/SalaryHistory'

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/loginpage' element={<Hrlogin/>}/>
        <Route path='/hr' element={<Hr/>}/>
        <Route path='/Manager' element={<Manager/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/user' element={<Employees />}/>
        <Route path='/profile' element ={<Profile/>}/>
        <Route path='/hrdashboard' element={<HrDashboard/>}/>
        <Route path='/view/:id' element={<ViewEmployee/>}/>
        <Route path = '/attendance' element={<Attendance/>}/>
        <Route path='/payroll' element ={<Payroll/>}/>
        <Route path='/salary-history' element={<SalaryHistory/>}/>
      </Routes>

    </div>
  )
}

export default App