import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../services/authService'
import { BrainCircuit, LayoutDashboard, PlusCircle, History, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <BrainCircuit size={28} className="brand-icon" />
        <span className="brand-name">AI Career Advisor</span>
      </div>

      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/profile/new" className={`nav-link ${isActive('/profile/new') ? 'active' : ''}`}>
            <PlusCircle size={18} />
            Nova Análise
          </Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
            <History size={18} />
            Histórico
          </Link>
        </div>
      )}

      {user && (
        <div className="navbar-user">
          <div className="user-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
            ) : (
              <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn-icon" onClick={handleLogout} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  )
}
