const BASE = import.meta.env.VITE_API_BASE || ''

async function request(path, opts = {}){
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(await res.text())
  return res.json().catch(()=>null)
}

export const api = {
  getDevices: () => request('/api/devices'),
  getLocations: () => request('/api/locations'),
}
