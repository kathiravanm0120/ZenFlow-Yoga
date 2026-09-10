'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'

type UserPoll = {
  id: number
  question: string
  status: 'Approved' | 'Pending Review' | 'Scheduled'
}

export default function UserDashboard() {
  const { user, role, enrolledClasses, toggleEnrollClass, classesList } = useAuth()
  const router = useRouter()
  const [userPolls, setUserPolls] = useState<UserPoll[]>([
    { id: 101, question: 'Sunset Yin Yoga & Candlelight Meditation', status: 'Approved' },
    { id: 102, question: 'Breathing Techniques for Better Sleep (Pranayama)', status: 'Scheduled' },
    { id: 103, question: 'Morning Sunrise Power Vinyasa at 6:30 AM', status: 'Pending Review' },
  ])
  const [newRequestText, setNewRequestText] = useState('')

  useEffect(() => {
    // If guest, redirect to login
    if (role === 'guest') {
      router.push('/login')
    }
  }, [role, router])

  const handleAddUserRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRequestText.trim()) return

    const newReq: UserPoll = {
      id: Date.now(),
      question: newRequestText.trim(),
      status: 'Pending Review',
    }
    setUserPolls([newReq, ...userPolls])
    setNewRequestText('')
  }

  const activeEnrolledClassesList = classesList.filter((c) =>
    enrolledClasses.includes(c.id)
  )

  return (
    <main className="dashboard-page-container">
      <Navbar isScrolled={true} />

      <div className="blob blob1" />
      <div className="blob blob2" />

      <div className="dashboard-content-wrapper">
        {/* User Hero Banner */}
        <div className="dashboard-header-banner user-banner">
          <div className="banner-info">
            <span className="badge-pill user-pill">🧘 Member Yogi Portal</span>
            <h1>Welcome Back, {user?.name || 'Mindful Yogi'}!</h1>
            <p>Your mind is serene, your body is resilient. Continue your wellness journey today.</p>
          </div>
          <div className="banner-quick-actions">
            <Link href="/#types" className="banner-btn primary">
              Explore All Classes
            </Link>
            <Link href="/" className="banner-btn secondary">
              View Main Site
            </Link>
          </div>
        </div>

        {/* Mindful Metrics Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-data">
              <h3>{user?.streakDays || 14} Days</h3>
              <p>Mindful Streak</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-data">
              <h3>{user?.minutesMeditated || 320} Mins</h3>
              <p>Total Practice Time</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="stat-icon">🧘‍♀️</div>
            <div className="stat-data">
              <h3>{user?.completedSessions || 24}</h3>
              <p>Sessions Completed</p>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-data">
              <h3>{enrolledClasses.length}</h3>
              <p>Active Class Bookings</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout (Grid) */}
        <div className="dashboard-main-grid">
          {/* Left Column: My Enrolled Schedule */}
          <div className="dash-section-card">
            <div className="section-card-header">
              <h2>📅 My Enrolled Schedule</h2>
              <span className="count-pill">{activeEnrolledClassesList.length} Enrolled</span>
            </div>

            {activeEnrolledClassesList.length === 0 ? (
              <div className="empty-state">
                <p>You haven't enrolled in any yoga classes yet. Browse our offerings below!</p>
              </div>
            ) : (
              <div className="enrolled-classes-list">
                {activeEnrolledClassesList.map((cls) => (
                  <div key={cls.id} className="enrolled-item-card">
                    <img src={cls.image} alt={cls.title} className="enrolled-img" />
                    <div className="enrolled-details">
                      <h4>{cls.title}</h4>
                      <p>Instructor: <strong>{cls.instructor}</strong> • {cls.duration}</p>
                      <span className="level-tag">{cls.level}</span>
                    </div>
                    <div className="enrolled-actions">
                      <button
                        className="join-live-btn"
                        onClick={() => alert(`Starting Live Session for ${cls.title}... 🧘✨`)}
                      >
                        Join Live 🎥
                      </button>
                      <button
                        className="cancel-enroll-btn"
                        onClick={() => toggleEnrollClass(cls.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Community Requests & Class Suggestions */}
          <div className="dash-section-card">
            <div className="section-card-header">
              <h2>🗣️ My Class Requests</h2>
            </div>

            {/* Request Submit Form */}
            <form onSubmit={handleAddUserRequest} className="user-request-form">
              <input
                type="text"
                className="user-request-input"
                placeholder="Suggest a new class or time schedule..."
                value={newRequestText}
                onChange={(e) => setNewRequestText(e.target.value)}
              />
              <button type="submit" className="user-request-submit-btn">
                Submit Request
              </button>
            </form>

            <div className="user-requests-list">
              {userPolls.map((poll) => (
                <div key={poll.id} className="request-status-item">
                  <span className="request-text">{poll.question}</span>
                  <span
                    className={`status-badge ${
                      poll.status === 'Approved'
                        ? 'approved'
                        : poll.status === 'Scheduled'
                        ? 'scheduled'
                        : 'pending'
                    }`}
                  >
                    {poll.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Available Yoga Classes Explorer */}
        <div className="dash-section-card full-width">
          <div className="section-card-header">
            <h2>🌸 Available Yoga Offerings</h2>
            <p className="sub-text">Click "Enroll" to add sessions directly to your schedule</p>
          </div>

          <div className="classes-grid">
            {classesList.map((cls) => {
              const isEnrolled = enrolledClasses.includes(cls.id)
              return (
                <div key={cls.id} className="available-class-card">
                  <img src={cls.image} alt={cls.title} />
                  <div className="card-body">
                    <h3>{cls.title}</h3>
                    <p>{cls.description}</p>
                    <div className="meta-info">
                      <span>👤 {cls.instructor}</span>
                      <span>⏱️ {cls.duration}</span>
                    </div>
                    <button
                      className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                      onClick={() => toggleEnrollClass(cls.id)}
                    >
                      {isEnrolled ? '✓ Enrolled in Schedule' : '+ Enroll in Class'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
