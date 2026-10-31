import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" />
          <p style={{ marginTop: 12, color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
