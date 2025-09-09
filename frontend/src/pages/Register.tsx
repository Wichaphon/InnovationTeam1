import { useState } from 'react'
import { User, registerRequest } from '../auth'
import FormInput from '../components/FormInput'
import FormError from '../components/FormError'
import FormButton from '../components/FormButton'

interface AuthHook {
  token: string;
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

interface RegisterProps {
  auth: AuthHook;
}

export default function Register({ }: RegisterProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const valid = email && password && fname && lname && password.length >= 8

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setError('')

    try {
      await registerRequest(email, password, fname, lname)
      window.location.replace('/')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'สมัครสมาชิกไม่สำเร็จ'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>สมัครสมาชิก</h1>

          <form onSubmit={submit} className="login-form">
            <FormError message={error} />

            <FormInput
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              placeholder="ชื่อ"
              required
              disabled={loading}
            />

            <FormInput
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              placeholder="นามสกุล"
              required
              disabled={loading}
            />

            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
              required
              disabled={loading}
            />

            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
              required
              disabled={loading}
              minLength={8}
            />

            <FormButton type="submit" loading={loading} loadingText="กำลังสมัครสมาชิก..." disabled={!valid}>
              สมัครสมาชิก
            </FormButton>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/" className="auth-nav-link">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</a>
          </div>
        </div>
      </div>
    </div>
  )
}


