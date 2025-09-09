import { User } from '../auth'

interface AuthHook {
  token: string;
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

interface NavbarProps {
  auth: AuthHook;
}

export default function Navbar({ auth }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          A12
        </div>
        
        <button 
          onClick={auth.logout}
          className="logout-btn"
        >
          ออกจากระบบ
        </button>
      </div>
    </nav>
  )
}
