'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { useAuth, ClassItem } from '../../context/AuthContext'

type AdminModerationItem = {
  id: number
  question: string
  submittedBy: string
  status: 'Approved' | 'Pending' | 'Rejected'
  date: string
}

export default function AdminDashboard() {
  const { user, role, classesList, addClass, updateClass, deleteClass } = useAuth()
  const router = useRouter()

  // Modal State for adding/editing class
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClassId, setEditingClassId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<ClassItem, 'id'>>({
    title: '',
    description: '',
    category: 'Vinyasa',
    instructor: '',
    duration: '45 mins',
    level: 'All Levels',
    image: 'https://assets.ccbp.in/frontend/static-website/yoga-card2-img.png',
    isActive: true,
  })

  // Community Moderation Requests State
  const [moderationList, setModerationList] = useState<AdminModerationItem[]>([
    { id: 1, question: 'Sunset Yin Yoga & Candlelight Meditation', submittedBy: 'Sarah M.', status: 'Approved', date: 'Today' },
    { id: 2, question: 'Morning Sunrise Power Vinyasa at 6:30 AM', submittedBy: 'Alex K.', status: 'Pending', date: 'Yesterday' },
    { id: 3, question: 'Hot Yoga Detox & Core Conditioning', submittedBy: 'David L.', status: 'Pending', date: '2 days ago' },
    { id: 4, question: 'Breathing Techniques for Better Sleep (Pranayama)', submittedBy: 'Emily R.', status: 'Approved', date: '3 days ago' },
  ])

  useEffect(() => {
    // If not admin, redirect to login or user portal
    if (role !== 'admin') {
      router.push('/login')
    }
  }, [role, router])

  // Open modal for new class
  const handleOpenNewModal = () => {
    setEditingClassId(null)
    setFormData({
      title: '',
      description: '',
      category: 'Vinyasa',
      instructor: '',
      duration: '45 mins',
      level: 'All Levels',
      image: 'https://assets.ccbp.in/frontend/static-website/yoga-card2-img.png',
      isActive: true,
    })
    setIsModalOpen(true)
  }

  // Open modal for editing existing class
  const handleOpenEditModal = (cls: ClassItem) => {
    setEditingClassId(cls.id)
    setFormData({
      title: cls.title,
      description: cls.description,
      category: cls.category,
      instructor: cls.instructor,
      duration: cls.duration,
      level: cls.level,
      image: cls.image,
      isActive: cls.isActive,
    })
    setIsModalOpen(true)
  }

  // Submit form for add/edit class
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.instructor) return

    if (editingClassId !== null) {
      updateClass(editingClassId, formData)
    } else {
      addClass(formData)
    }
    setIsModalOpen(false)
  }

  // Moderation status updates
  const handleUpdateStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setModerationList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    )
  }

  const handleDeleteModeration = (id: number) => {
    setModerationList((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <main className="dashboard-page-container">
      <Navbar isScrolled={true} />

      <div className="blob blob1" />
      <div className="blob blob2" />

      <div className="dashboard-content-wrapper">
        {/* Admin Header Banner */}
        <div className="dashboard-header-banner admin-banner">
          <div className="banner-info">
            <span className="badge-pill admin-pill">🛡️ ZenFlow Operations Manager</span>
            <h1>Admin Management Control Panel</h1>
            <p>Monitor platform statistics, update class offerings, and moderate community requests.</p>
          </div>
          <div className="banner-quick-actions">
            <button className="banner-btn primary" onClick={handleOpenNewModal}>
              + Create New Class
            </button>
            <Link href="/" className="banner-btn secondary">
              Preview Live Site
            </Link>
          </div>
        </div>

        {/* Platform Analytics Cards */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-card admin-stat">
            <div className="stat-icon">👥</div>
            <div className="stat-data">
              <h3>10,482</h3>
              <p>Active Registered Yogis</p>
            </div>
          </div>

          <div className="dash-stat-card admin-stat">
            <div className="stat-icon">📈</div>
            <div className="stat-data">
              <h3>512</h3>
              <p>Daily Completed Sessions</p>
            </div>
          </div>

          <div className="dash-stat-card admin-stat">
            <div className="stat-icon">💖</div>
            <div className="stat-data">
              <h3>95.4%</h3>
              <p>Stress Reduction Rate</p>
            </div>
          </div>

          <div className="dash-stat-card admin-stat">
            <div className="stat-icon">💎</div>
            <div className="stat-data">
              <h3>{classesList.length}</h3>
              <p>Live Class Offerings</p>
            </div>
          </div>
        </div>

        {/* Admin CRUD Table: Class Offerings */}
        <div className="dash-section-card full-width">
          <div className="section-card-header">
            <div>
              <h2>🧘 Manage Yoga Class Offerings</h2>
              <p className="sub-text">Edits and additions reflect live on the website in real time</p>
            </div>
            <button className="create-class-btn" onClick={handleOpenNewModal}>
              + Add Class
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Class Title</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classesList.map((cls) => (
                  <tr key={cls.id}>
                    <td className="font-semibold">{cls.title}</td>
                    <td><span className="cat-badge">{cls.category}</span></td>
                    <td>{cls.instructor}</td>
                    <td>{cls.duration}</td>
                    <td>{cls.level}</td>
                    <td>
                      <span className={`status-pill ${cls.isActive ? 'active' : 'inactive'}`}>
                        {cls.isActive ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button
                          className="tbl-action-btn edit"
                          onClick={() => handleOpenEditModal(cls)}
                        >
                          Edit
                        </button>
                        <button
                          className="tbl-action-btn delete"
                          onClick={() => {
                            if (confirm(`Delete "${cls.title}"?`)) {
                              deleteClass(cls.id)
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Section: Moderation & Activity Log */}
        <div className="dashboard-main-grid">
          {/* Left Column: Community Requests Moderation */}
          <div className="dash-section-card">
            <div className="section-card-header">
              <h2>🗣️ Community Voice Moderation</h2>
              <span className="count-pill">{moderationList.length} Pending & Reviewed</span>
            </div>

            <div className="moderation-list">
              {moderationList.map((item) => (
                <div key={item.id} className="moderation-item-card">
                  <div className="mod-info">
                    <h4>{item.question}</h4>
                    <p>Submitted by: <strong>{item.submittedBy}</strong> • {item.date}</p>
                    <span className={`mod-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mod-actions">
                    {item.status !== 'Approved' && (
                      <button
                        className="mod-btn approve"
                        onClick={() => handleUpdateStatus(item.id, 'Approved')}
                      >
                        Approve
                      </button>
                    )}
                    {item.status !== 'Rejected' && (
                      <button
                        className="mod-btn reject"
                        onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      className="mod-btn delete"
                      onClick={() => handleDeleteModeration(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: System & Recent Activity */}
          <div className="dash-section-card">
            <div className="section-card-header">
              <h2>⚡ Recent System Activity</h2>
            </div>

            <div className="activity-feed-list">
              <div className="activity-feed-item">
                <span className="feed-icon green">👤</span>
                <div>
                  <p><strong>Sarah Miller</strong> completed <i>60 mins Vinyasa Energy Flow</i></p>
                  <span className="feed-time">10 mins ago</span>
                </div>
              </div>

              <div className="activity-feed-item">
                <span className="feed-icon purple">✨</span>
                <div>
                  <p>New user registered: <strong>Alex Chen</strong></p>
                  <span className="feed-time">25 mins ago</span>
                </div>
              </div>

              <div className="activity-feed-item">
                <span className="feed-icon cyan">🌸</span>
                <div>
                  <p>Community Voice request approved: <i>Sunset Yin Yoga</i></p>
                  <span className="feed-time">1 hour ago</span>
                </div>
              </div>

              <div className="activity-feed-item">
                <span className="feed-icon yellow">⚙️</span>
                <div>
                  <p>System auto-backup completed successfully</p>
                  <span className="feed-time">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Add/Edit Class */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingClassId !== null ? 'Edit Yoga Class' : 'Create New Yoga Class'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="modal-form">
              <div className="form-group">
                <label>Class Title</label>
                <input
                  type="text"
                  className="auth-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sunset Yin & Sound Bath"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="auth-input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as any })
                    }
                  >
                    <option value="Vinyasa">Vinyasa</option>
                    <option value="Acro">Acro</option>
                    <option value="Hatha">Hatha</option>
                    <option value="Kundalini">Kundalini</option>
                    <option value="Yin">Yin</option>
                    <option value="Restorative">Restorative</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="Instructor Name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g. All Levels"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="auth-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Image URL"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="auth-input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the session benefits and style..."
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Class Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
