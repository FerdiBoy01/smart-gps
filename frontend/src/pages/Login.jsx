import React from 'react'

export default function Login(){
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input type="password" className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  )
}
