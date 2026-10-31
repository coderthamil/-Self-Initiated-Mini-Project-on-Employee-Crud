import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()
const BASE_URL = 'http://localhost:5205/api'

// Always attach JWT from localStorage on every request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username, password })
    const { token, username: name, email } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ username: name, email }))
    setUser({ username: name, email })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { BASE_URL }
