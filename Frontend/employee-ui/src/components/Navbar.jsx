import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
      gap: '8px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #6c63ff, #e94560)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0
        }}>👥</div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
          Employee<span style={{ color: '#6c63ff' }}>MS</span>
        </span>
      </div>

      {/* User info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.08)', borderRadius: '20px',
          padding: '6px 14px'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #e94560)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#fff',
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>
            {user.username}
          </span>
          <span style={{
            background: '#6c63ff', color: '#fff', fontSize: '10px',
            padding: '2px 8px', borderRadius: '10px', fontWeight: 600, letterSpacing: '0.5px'
          }}>ADMIN</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.4)',
          color: '#e94560', borderRadius: '8px', padding: '7px 16px',
          cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          transition: 'all 0.2s',
        }}
          onMouseOver={e => e.target.style.background = 'rgba(233,69,96,0.3)'}
          onMouseOut={e => e.target.style.background = 'rgba(233,69,96,0.15)'}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

