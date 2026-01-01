import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Devices from './pages/Devices'
import Locations from './pages/Locations'

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Devices/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/locations' element={<Locations/>} />
      </Routes>
    </Layout>
  )
}
