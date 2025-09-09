import { useEffect, useState } from 'react'
import { API_BASE, User } from '../auth'

interface AuthHook {
  token: string;
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

interface AdminProps {
  auth: AuthHook;
}

interface Role {
  id: string;
  name: string;
}

interface CreateForm {
  email: string;
  password: string;
  fname: string;
  lname: string;
  roleId: string;
}

export default function Admin({ auth }: AdminProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [createForm, setCreateForm] = useState<CreateForm>({ 
    email: '', 
    password: '', 
    fname: '', 
    lname: '', 
    roleId: '' 
  })
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rbac/roles`, { 
        headers: { Authorization: `Bearer ${auth.token}` } 
      })
      const data = await res.json()
      if (res.ok) setRoles(data)
    } catch (e) {
      console.error('Failed to fetch roles:', e)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setMessage('')
    
    try {
      const res = await fetch(`${API_BASE}/api/rbac/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${auth.token}` 
        },
        body: JSON.stringify(createForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'สร้างผู้ใช้ล้มเหลว')
      
      setMessage(`สร้างผู้ใช้สำเร็จ: ${data.email}`)
      setCreateForm({ email: '', password: '', fname: '', lname: '', roleId: '' })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'สร้างผู้ใช้ล้มเหลว'
      setMessage(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Panel</h1>
        
        <div className="create-user-form">
          <h2>สร้างผู้ใช้ใหม่</h2>
          
          {message && (
            <div className={`message ${message.includes('สำเร็จ') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={createUser}>
            <div className="form-row">
              <input
                type="text"
                value={createForm.fname}
                onChange={(e) => setCreateForm({ ...createForm, fname: e.target.value })}
                placeholder="ชื่อ"
                required
                disabled={creating}
              />
              
              <input
                type="text"
                value={createForm.lname}
                onChange={(e) => setCreateForm({ ...createForm, lname: e.target.value })}
                placeholder="นามสกุล"
                required
                disabled={creating}
              />
            </div>
            
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="อีเมล"
              required
              disabled={creating}
            />
            
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              placeholder="รหัสผ่าน"
              required
              disabled={creating}
            />
            
            <select
              value={createForm.roleId}
              onChange={(e) => setCreateForm({ ...createForm, roleId: e.target.value })}
              required
              disabled={creating}
            >
              <option value="">เลือกบทบาท</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            
            <button
              type="submit"
              disabled={creating}
            >
              {creating ? 'กำลังสร้าง...' : 'สร้างผู้ใช้'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
