import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../context/AuthContext'

const API = `${BASE_URL}/employees`

const emptyForm = { name: '', department: '', designation: '', salary: '', phone: '', email: '' }

// ── Validators ───────────────────────────────────────────────────
const ONLY_TEXT = /^[A-Za-z\s\-'.]+$/
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ONLY_DIGITS_10 = /^\d{10}$/

function validate(form) {
  const errs = {}

  if (!form.name.trim())
    errs.name = 'Name is required'
  else if (!ONLY_TEXT.test(form.name.trim()))
    errs.name = 'Name must contain letters only (no numbers or special chars)'
  else if (form.name.trim().length < 2)
    errs.name = 'Name must be at least 2 characters'

  if (!form.department.trim())
    errs.department = 'Department is required'
  else if (!ONLY_TEXT.test(form.department.trim()))
    errs.department = 'Department must contain letters only'

  if (!form.designation.trim())
    errs.designation = 'Designation is required'
  else if (!ONLY_TEXT.test(form.designation.trim()))
    errs.designation = 'Designation must contain letters only'

  if (!form.salary)
    errs.salary = 'Salary is required'
  else if (isNaN(form.salary) || Number(form.salary) <= 0)
    errs.salary = 'Salary must be a positive number'
  else if (Number(form.salary) > 10000000)
    errs.salary = 'Salary seems too high'

  if (!form.phone.trim())
    errs.phone = 'Phone is required'
  else if (!ONLY_DIGITS_10.test(form.phone.trim()))
    errs.phone = 'Phone must be exactly 10 digits (numbers only)'

  if (!form.email.trim())
    errs.email = 'Email is required'
  else if (!VALID_EMAIL.test(form.email.trim()))
    errs.email = 'Enter a valid email address'

  return errs
}

// ── Field component ───────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: 5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: '#ef4444', fontSize: '11px', marginTop: 3, display: 'block' }}>
          ⚠ {error}
        </span>
      )}
    </div>
  )
}

const inputStyle = (hasError) => ({
  width: '100%', padding: '10px 12px',
  border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: '10px', fontSize: '14px', outline: 'none',
  background: hasError ? '#fff5f5' : '#fff',
  color: '#1a1a2e', transition: 'border 0.2s',
})

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API)
      setEmployees(res.data)
    } catch {
      showToast('Failed to load employees — check if backend is running', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadEmployees() }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    // Clear error on change
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, salary: parseFloat(form.salary) }
      if (editId) {
        await axios.put(`${API}/${editId}`, { id: editId, ...payload })
        showToast('Employee updated successfully!')
      } else {
        await axios.post(API, payload)
        showToast('Employee added successfully!')
      }
      setForm(emptyForm)
      setErrors({})
      setEditId(null)
      loadEmployees()
    } catch {
      showToast('Failed to save employee', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      salary: String(emp.salary),
      phone: emp.phone,
      email: emp.email,
    })
    setErrors({})
    setEditId(emp.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setErrors({})
    setEditId(null)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`)
      setDeleteId(null)
      showToast('Employee deleted')
      loadEmployees()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  // Filtered list
  const filtered = employees.filter(e =>
    [e.name, e.department, e.designation, e.email].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const depts = [...new Set(employees.map(e => e.department))]

  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position: 'fixed', top: 80, right: 20, zIndex: 9999,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', padding: '12px 20px', borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease',
          }}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        )}

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Employees', value: employees.length, icon: '👥', color: '#6c63ff' },
            { label: 'Departments', value: depts.length, icon: '🏢', color: '#10b981' },
            {
              label: 'Avg Salary', icon: '💰', color: '#f59e0b',
              value: employees.length
                ? `$${Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length).toLocaleString()}`
                : '$0'
            },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', borderRadius: '16px', padding: '20px',
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px'
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: 3 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <div style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 24, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: editId
              ? 'linear-gradient(135deg, #f59e0b, #f97316)'
              : 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: '20px' }}>{editId ? '✏️' : '➕'}</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
              {editId ? 'Edit Employee' : 'Add New Employee'}
            </span>
            {editId && (
              <span style={{
                marginLeft: 'auto', background: 'rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '12px', padding: '3px 10px', borderRadius: '20px'
              }}>
                Editing ID #{editId}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

              <Field label="Full Name *" error={errors.name}>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Letters only (e.g. Alice Johnson)"
                  style={inputStyle(!!errors.name)}
                  onFocus={e => !errors.name && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.name && (e.target.style.borderColor = '#e5e7eb')}
                />
              </Field>

              <Field label="Department *" error={errors.department}>
                <input
                  name="department" value={form.department} onChange={handleChange}
                  placeholder="e.g. Engineering"
                  style={inputStyle(!!errors.department)}
                  onFocus={e => !errors.department && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.department && (e.target.style.borderColor = '#e5e7eb')}
                />
              </Field>

              <Field label="Designation *" error={errors.designation}>
                <input
                  name="designation" value={form.designation} onChange={handleChange}
                  placeholder="e.g. Senior Developer"
                  style={inputStyle(!!errors.designation)}
                  onFocus={e => !errors.designation && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.designation && (e.target.style.borderColor = '#e5e7eb')}
                />
              </Field>

              <Field label="Salary ($) *" error={errors.salary}>
                <input
                  type="number" name="salary" value={form.salary} onChange={handleChange}
                  placeholder="e.g. 75000" min="1"
                  style={inputStyle(!!errors.salary)}
                  onFocus={e => !errors.salary && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.salary && (e.target.style.borderColor = '#e5e7eb')}
                />
              </Field>

              <Field label="Phone (10 digits) *" error={errors.phone}>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  style={inputStyle(!!errors.phone)}
                  onFocus={e => !errors.phone && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.phone && (e.target.style.borderColor = '#e5e7eb')}
                  onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault() }}
                />
              </Field>

              <Field label="Email Address *" error={errors.email}>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="e.g. alice@company.com"
                  style={inputStyle(!!errors.email)}
                  onFocus={e => !errors.email && (e.target.style.borderColor = '#6c63ff')}
                  onBlur={e => !errors.email && (e.target.style.borderColor = '#e5e7eb')}
                />
              </Field>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {editId && (
                <button type="button" onClick={handleCancel} style={{
                  padding: '10px 22px', background: '#f3f4f6', border: '1.5px solid #e5e7eb',
                  borderRadius: '10px', color: '#6b7280', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer',
                }}>
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving} style={{
                padding: '10px 28px',
                background: saving ? '#c4b5fd' : editId ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
              }}>
                {saving ? 'Saving...' : editId ? '✔ Update Employee' : '+ Add Employee'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Table card ── */}
        <div style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            padding: '18px 24px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '18px' }}>📋</span>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e' }}>
                Employee Records
              </span>
              <span style={{
                background: '#f3f4f6', color: '#6b7280',
                fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600
              }}>
                {filtered.length} found
              </span>
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, dept, email..."
                style={{
                  padding: '9px 14px 9px 34px', border: '1.5px solid #e5e7eb',
                  borderRadius: '10px', fontSize: '13px', outline: 'none',
                  width: '240px', maxWidth: '100%', color: '#1a1a2e'
                }}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div className="spinner-border text-primary" />
              <p style={{ marginTop: 12 }}>Loading employees...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: 12 }}>👤</div>
              <p style={{ fontWeight: 600 }}>{search ? 'No results found' : 'No employees yet'}</p>
              <p style={{ fontSize: '13px' }}>{search ? 'Try a different search' : 'Add your first employee above'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8f9ff' }}>
                    {['ID', 'Name', 'Department', 'Designation', 'Salary', 'Phone', 'Email', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        color: '#6b7280', fontWeight: 600, fontSize: '12px',
                        letterSpacing: '0.5px', textTransform: 'uppercase',
                        borderBottom: '2px solid #f3f4f6', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => (
                    <tr key={emp.id} style={{
                      borderBottom: '1px solid #f9fafb',
                      background: i % 2 === 0 ? '#fff' : '#fafbff',
                      transition: 'background 0.15s',
                    }}
                      onMouseOver={e => e.currentTarget.style.background = '#f0f2ff'}
                      onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbff'}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          background: '#ede9fe', color: '#6c63ff',
                          borderRadius: '6px', padding: '2px 8px', fontWeight: 700, fontSize: '12px'
                        }}>#{emp.id}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: `hsl(${emp.id * 47 % 360}, 65%, 55%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '13px', fontWeight: 700
                          }}>{emp.name.charAt(0)}</div>
                          {emp.name}
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          background: '#f0fdf4', color: '#16a34a',
                          borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600
                        }}>{emp.department}</span>
                      </td>
                      <td style={{ padding: '13px 16px', color: '#4b5563' }}>{emp.designation}</td>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: '#059669', whiteSpace: 'nowrap' }}>
                        ${Number(emp.salary).toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#4b5563', whiteSpace: 'nowrap' }}>{emp.phone}</td>
                      <td style={{ padding: '13px 16px', color: '#6b7280', fontSize: '13px' }}>{emp.email}</td>
                      <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleEdit(emp)} style={{
                          background: '#fef3c7', border: 'none', color: '#d97706',
                          borderRadius: '8px', padding: '6px 14px', fontSize: '12px',
                          fontWeight: 600, cursor: 'pointer', marginRight: 6
                        }}>✏️ Edit</button>
                        <button onClick={() => setDeleteId(emp.id)} style={{
                          background: '#fee2e2', border: 'none', color: '#dc2626',
                          borderRadius: '8px', padding: '6px 14px', fontSize: '12px',
                          fontWeight: 600, cursor: 'pointer'
                        }}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete modal ── */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px',
            maxWidth: 380, width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: 8, fontWeight: 700 }}>Delete Employee</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: 24 }}>
              Are you sure you want to delete Employee #{deleteId}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '10px 24px', background: '#f3f4f6', border: '1.5px solid #e5e7eb',
                borderRadius: '10px', color: '#6b7280', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
              }}>Cancel</button>
              <button onClick={confirmDelete} style={{
                padding: '10px 24px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600,
                cursor: 'pointer', fontSize: '14px',
                boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
