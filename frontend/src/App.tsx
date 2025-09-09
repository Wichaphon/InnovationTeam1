import { useEffect, useState, ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { 
  getToken, 
  setToken, 
  fetchMe, 
  loginRequest, 
  getRefreshToken, 
  setRefreshToken, 
  refreshTokens, 
  logoutRequest,
  User,
  LoginResponse 
} from './auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import UserPage from './pages/User'
import OAuthCallback from './pages/OAuthCallback'

// Auth hook interface
interface AuthHook {
  token: string;
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

function useAuth(): AuthHook {
  const [token, setTok] = useState<string>(getToken())
  const [refresh, setRef] = useState<string>(getRefreshToken())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    const run = async () => {
      try {
        const u = await fetchMe(token)
        setUser(u)
      } catch (e) {
        // try refresh
        try {
          if (refresh) {
            const data = await refreshTokens(refresh)
            setToken(data.token)
            setRefreshToken(data.refreshToken)
            setTok(data.token)
            setRef(data.refreshToken)
            setUser(data.user)
          } else {
            setUser(null)
          }
        } catch (_) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token, refresh])

  const role = user?.role?.name || null
  
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const data = await loginRequest(email, password)
    setToken(data.token)
    setTok(data.token)
    setRefreshToken(data.refreshToken)
    setRef(data.refreshToken)
    setUser(data.user)
    return data
  }
  
  const logout = () => {
    const rt = getRefreshToken()
    if (rt) logoutRequest(rt)
    setToken('')
    setRefreshToken('')
    setTok('')
    setRef('')
    setUser(null)
  }
  
  return { token, user, role, loading, login, logout }
}

// Protected route component
interface ProtectedProps {
  token: string;
  children: ReactNode;
}

function Protected({ token, children }: ProtectedProps) {
  if (!token) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const auth = useAuth()

  // If not logged in, show login/register pages without navbar
  if (!auth.token) {
    return (
      <div className="app">
        <Routes>
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/register" element={<Register auth={auth} />} />
          <Route path="*" element={<Login auth={auth} />} />
        </Routes>
      </div>
    )
  }


  return (
    <div className="app">
      <Navbar auth={auth} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            auth.role === 'Admin' 
              ? <Navigate to="/admin" replace />
              : <Navigate to="/user" replace />
          } />
          <Route path="/admin" element={
            <Protected token={auth.token}>
              {auth.role === 'Admin' ? <Admin auth={auth} /> : <Navigate to="/user" replace />}
            </Protected>
          } />
          <Route path="/user" element={
            <Protected token={auth.token}>
              {auth.role === 'Admin' ? <Navigate to="/admin" replace /> : <UserPage auth={auth} />}
            </Protected>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
