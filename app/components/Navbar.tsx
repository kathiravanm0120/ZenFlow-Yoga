'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const LotusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '28px', height: '28px', color: '#00d4ff' }}
  >
    <path d="M12 2c1.5 3 3.5 3 5.5 3s3-1.5 3-3-1.5-3-3-3-4 1-5.5 3z" />
    <path d="M12 2c-1.5 3-3.5 3-5.5 3s-3-1.5-3-3 1.5-3 3-3 4 1 5.5 3z" />
    <path d="M12 10c2 4 4 4 6 4s3-2 3-4-2-4-4-4-5 1.5-5 4z" />
    <path d="M12 10c-2 4-4 4-6 4s-3-2-3-4 2-4 4-4 5 1.5 5 4z" />
    <path d="M12 22c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5z" />
  </svg>
)

export default function Navbar({ isScrolled }: { isScrolled?: boolean }) {
  const { user, role, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">
        <LotusIcon />
        ZenFlow <span>Yoga</span>
      </Link>

      <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <li>
          <Link href="/" className={pathname === '/' ? 'active-link' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/#types">Yoga Styles</Link>
        </li>
        <li>
          <Link href="/#stats">Stats</Link>
        </li>
        <li>
          <Link href="/#community">Community Voice</Link>
        </li>

        {/* Dynamic Role Dashboard Link */}
        {role === 'user' && (
          <li>
            <Link
              href="/dashboard/user"
              className={`role-nav-badge user ${pathname.startsWith('/dashboard/user') ? 'active-badge' : ''}`}
            >
              🧘 Member Portal
            </Link>
          </li>
        )}

        {role === 'admin' && (
          <li>
            <Link
              href="/dashboard/admin"
              className={`role-nav-badge admin ${pathname.startsWith('/dashboard/admin') ? 'active-badge' : ''}`}
            >
              🛡️ Admin Manager
            </Link>
          </li>
        )}
      </ul>

      {/* Right Side Controls */}
      <div className="nav-right">
        {user ? (
          <div className="user-profile-menu">
            <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="nav-btn">
            Login / Portal
          </Link>
        )}

        {/* Hamburger Toggler */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
