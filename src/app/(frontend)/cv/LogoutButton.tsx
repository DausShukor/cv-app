'use client'

import { useState } from 'react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/frontend-users/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      window.location.href = '/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 print:hidden"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
