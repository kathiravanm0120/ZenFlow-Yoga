'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useAuth, UserRole } from '../context/AuthContext'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    login(email, selectedRole, name || undefined)

    if (selectedRole === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
    }
  }

  const handleDemoLogin = (roleToLogin: UserRole) => {
    if (roleToLogin === 'admin') {
      login('admin@zenflow.com', 'admin', 'Zen Admin Manager')
      router.push('/dashboard/admin')
    } else {
      login('sarah.miller@zenflow.com', 'user', 'Sarah Miller')
      router.push('/dashboard/user')
    }
  }

  return (
    <main className="auth-page-container">
      <Navbar isScrolled={true} />

      <div className="blob blob1" />
      <div className="blob blob2" />

      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome to <span>ZenFlow</span></h2>
            <p>Access your personalized portal and mindful journeys</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="role-selector-tabs">
            <button
              className={`role-tab ${selectedRole === 'user' ? 'active' : ''}`}
              onClick={() => setSelectedRole('user')}
            >
              🧘 Member Yogi
            </button>
            <button
              className={`role-tab admin ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              🛡️ Admin Manager
            </button>
          </div>

          {/* Quick Demo Access Notice */}
          <div className="demo-credentials-box">
            <span className="demo-title">🚀 Fast Demo One-Click Access</span>
            <div className="demo-buttons-grid">
              <button
                type="button"
                className="demo-btn member"
                onClick={() => handleDemoLogin('user')}
              >
                Login as Member User
              </button>
              <button
                type="button"
                className="demo-btn admin"
                onClick={() => handleDemoLogin('admin')}
              >
                Login as Admin Manager
              </button>
            </div>
          </div>

          <div className="auth-divider">
            <span>OR ENTER CREDENTIALS</span>
          </div>

          {/* Login / Register Form */}
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Sarah Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="auth-input"
                placeholder={selectedRole === 'admin' ? 'admin@zenflow.com' : 'yogi@zenflow.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              {isSignup ? `Register as ${selectedRole === 'admin' ? 'Admin' : 'Member'}` : `Sign In to ${selectedRole === 'admin' ? 'Admin Dashboard' : 'User Portal'}`}
            </button>
          </form>

          <div className="auth-footer">
            <button
              className="auth-toggle-mode-btn"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Sign In' : 'New to ZenFlow? Create an Account'}
            </button>
            <div style={{ marginTop: '12px' }}>
              <Link href="/" className="back-home-link">
                ← Back to ZenFlow Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
