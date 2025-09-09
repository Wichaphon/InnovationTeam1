import { User } from '../auth'

interface AuthHook {
  token: string;
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

interface UserProps {
  auth: AuthHook;
}

export default function UserPage({ auth }: UserProps) {
  return (
    <div className="user-page">
      <div className="user-container">
        <h1>User Dashboard</h1>
        <p>สวัสดี {auth.user?.fname || auth.user?.email}</p>
      </div>
    </div>
  )
}
