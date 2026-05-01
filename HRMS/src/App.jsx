
import React from 'react'
import Home from './components/Home'
import { Route, Routes } from 'react-router'
import Login from './pages/login/Login'
import Hrlogin from './screen/login-page/Hrlogin'
import Hr from './screen/hr/hr'

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hrlogin' element={<Hrlogin/>}/>
        <Route path='/hr' element={<Hr/>}/>
      </Routes>

    </div>
  )
}

export default App