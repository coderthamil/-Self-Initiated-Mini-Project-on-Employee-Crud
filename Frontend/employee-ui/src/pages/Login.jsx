import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim()) return setError('Username is required')
    if (!form.password) return setError('Password is required')

    setLoading(true)
    try {
      await login(form.username.trim(), form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      padding: '20px',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)',
        top: '10%', left: '10%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.1), transparent)',
        bottom: '15%', right: '15%', pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '18px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6c63ff, #e94560)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', boxShadow: '0 8px 24px rgba(108,99,255,0.4)'
          }}>👥</div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, marginBottom: 4 }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Sign in to Employee Management System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: 20,
            color: '#f87171', fontSize: '14px', display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: 8, letterSpacing: '0.5px' }}>
              USERNAME
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>👤</span>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', color: '#fff', fontSize: '15px',
                  outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6c63ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: 8, letterSpacing: '0.5px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', color: '#fff', fontSize: '15px',
                  outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6c63ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                autoComplete="current-password"
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                  padding: 4, color: 'rgba(255,255,255,0.5)'
                }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #e94560)',
            border: 'none', borderRadius: '12px', color: '#fff',
            fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
            transition: 'all 0.2s', letterSpacing: '0.5px'
          }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner-border spinner-border-sm" /> Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        {/* Hint */}
        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '10px', textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: 4 }}>Admin Credentials</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'monospace' }}>
            admin / admin@123
          </p>
        </div>
      </div>
    </div>
  )
}
