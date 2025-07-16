'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Front-end validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError(null)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })

    const data = await res.json()
    setMessage(data.message || null)
    setError(data.error || null)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Update Password
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      {message && <p className="mt-4 text-sm text-green-600 text-center">{message}</p>}
    </div>
  )
}
