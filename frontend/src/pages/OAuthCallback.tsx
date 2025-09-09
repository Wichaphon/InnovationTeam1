import { useEffect } from 'react'
import { setToken, setRefreshToken } from '../auth'
import { useNavigate } from 'react-router-dom'

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token') || ''
      const refreshToken = params.get('refreshToken') || ''
      const role = (params.get('role') || '').toLowerCase()
      const error = params.get('error') || ''
      if (token && refreshToken) {
        setToken(token)
        setRefreshToken(refreshToken)
        const target = role === 'admin' ? '/admin' : '/user'
        // Force reload to sync App state with new tokens in localStorage immediately
        window.location.replace(target)
        return
      }
      if (error) {
        window.location.replace('/')
        return
      }
    } finally {
      // Fallback to home if neither tokens nor error are present
      window.location.replace('/')
    }
  }, [navigate])

  return (
    <div style={{ padding: 24 }}>กำลังเข้าสู่ระบบ...</div>
  )
}


