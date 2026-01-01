import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">PRATIA</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-sm text-gray-700">Devices</Link>
            <Link to="/locations" className="text-sm text-gray-700">Locations</Link>
            <Link to="/login" className="text-sm text-gray-700">Login</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 flex-1">{children}</main>
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">© PRATIA</footer>
    </div>
  )
}
