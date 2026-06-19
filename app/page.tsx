'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useRef } from 'react'
import ChatBot from './components/ChatBot'

type Poll = {
  id: number
  question: string
}

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

export default function Home() {
  const [question, setQuestion] = useState('')
  const [polls, setPolls] = useState<Poll[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Animated counters
  const [stats, setStats] = useState({ yogis: 0, sessions: 0, stress: 0 })
  
  const statsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const supabase = createClient()

  // Fetch polls
  const getPolls = async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('id', { ascending: false })

    if (!error && data) {
      setPolls(data)
    }
  }

  // Add poll
  const addPoll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    const { error } = await supabase
      .from('polls')
      .insert([{ question }])

    if (!error) {
      setQuestion('')
      getPolls()
    }
  }

  // Delete poll
  const deletePoll = async (id: number) => {
    await supabase
      .from('polls')
      .delete()
      .eq('id', id)

    getPolls()
  }

  // Update poll
  const updatePoll = async (id: number) => {
    if (!editText.trim()) return

    await supabase
      .from('polls')
      .update({ question: editText })
      .eq('id', id)

    setEditingId(null)
    setEditText('')
    getPolls()
  }

  useEffect(() => {
    getPolls()
  }, [])

  // Scroll reveal Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Stats counter Intersection Observer
  useEffect(() => {
    let started = false
    const statsEl = statsRef.current
    if (!statsEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true

          // Animate Happy Yogis (0 to 10)
          let yogisCount = 0
          const yogisInterval = setInterval(() => {
            yogisCount += 1
            if (yogisCount >= 10) {
              setStats((prev) => ({ ...prev, yogis: 10 }))
              clearInterval(yogisInterval)
            } else {
              setStats((prev) => ({ ...prev, yogis: yogisCount }))
            }
          }, 100)

          // Animate Daily Sessions (0 to 500)
          let sessionsCount = 0
          const sessionsInterval = setInterval(() => {
            sessionsCount += 20
            if (sessionsCount >= 500) {
              setStats((prev) => ({ ...prev, sessions: 500 }))
              clearInterval(sessionsInterval)
            } else {
              setStats((prev) => ({ ...prev, sessions: sessionsCount }))
            }
          }, 30)

          // Animate Stress Reduced (0 to 95)
          let stressCount = 0
          const stressInterval = setInterval(() => {
            stressCount += 5
            if (stressCount >= 95) {
              setStats((prev) => ({ ...prev, stress: 95 }))
              clearInterval(stressInterval)
            } else {
              setStats((prev) => ({ ...prev, stress: stressCount }))
            }
          }, 35)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(statsEl)
    return () => {
      if (statsEl) observer.unobserve(statsEl)
    }
  }, [])

  // Navbar scroll background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse Parallax Effect on Hero Image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (imageRef.current) {
        const x = (window.innerWidth / 2 - e.clientX) / 40
        const y = (window.innerHeight / 2 - e.clientY) / 40
        imageRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Hover Glow effect on cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Background Glow Blobs */}
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo" onClick={() => scrollToId('home')}>
          <LotusIcon />
          ZenFlow <span>Yoga</span>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home') }}>
              Home
            </a>
          </li>
          <li>
            <a href="#types" onClick={(e) => { e.preventDefault(); scrollToId('types') }}>
              Yoga
            </a>
          </li>
          <li>
            <a href="#stats" onClick={(e) => { e.preventDefault(); scrollToId('stats') }}>
              Stats
            </a>
          </li>
          <li>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToId('testimonials') }}>
              Reviews
            </a>
          </li>
          <li>
            <a href="#community" onClick={(e) => { e.preventDefault(); scrollToId('community') }}>
              Community Voice
            </a>
          </li>
        </ul>

        <button className="nav-btn" onClick={() => scrollToId('community')}>
          Join Now
        </button>

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
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-text reveal">
          <h1>Find Inner Peace Through Yoga</h1>
          <p>
            Experience wellness, mindfulness, and complete body transformation
            through our immersive yoga journeys. Reconnect with yourself today.
          </p>
          <button className="main-btn" onClick={() => scrollToId('types')}>
            Start Journey
          </button>
        </div>

        <div className="hero-image reveal">
          <img
            ref={imageRef}
            src="https://assets.ccbp.in/frontend/static-website/yoga-girl-with-headphones-img.png"
            alt="Zen Yoga Illustration"
            style={{ transition: 'transform 0.1s ease-out' }}
          />
        </div>
      </section>

      {/* Yoga Types Section */}
      <section className="types" id="types">
        <h2 className="section-title reveal">Explore Yoga Types</h2>
        <p className="section-subtitle reveal">
          Discover a variety of styles designed to help you balance your body, mind,
          and soul. Find the practice that speaks directly to you.
        </p>

        <div className="cards">
          <div className="card reveal" onMouseMove={handleCardMouseMove}>
            <img
              src="https://assets.ccbp.in/frontend/static-website/yoga-card1-img.png"
              alt="Acro Yoga icon"
            />
            <h3>Acro Yoga</h3>
            <p>Improve your overall strength, stability, and mutual physical trust.</p>
          </div>

          <div className="card reveal" onMouseMove={handleCardMouseMove}>
            <img
              src="https://assets.ccbp.in/frontend/static-website/yoga-card2-img.png"
              alt="Vinyasa Yoga icon"
            />
            <h3>Vinyasa Yoga</h3>
            <p>Build stamina, increase flow rate, and release daily built-up stress.</p>
          </div>

          <div className="card reveal" onMouseMove={handleCardMouseMove}>
            <img
              src="https://assets.ccbp.in/frontend/static-website/yoga-card3-img.png"
              alt="Hatha Yoga icon"
            />
            <h3>Hatha Yoga</h3>
            <p>Refine physical posture, structural alignment, and core stability.</p>
          </div>

          <div className="card reveal" onMouseMove={handleCardMouseMove}>
            <img
              src="https://assets.ccbp.in/frontend/static-website/yoga-card4-img.png"
              alt="Kundalini Yoga icon"
            />
            <h3>Kundalini Yoga</h3>
            <p>Elevate spiritual awareness, cognitive focus, and active energy flows.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats reveal" id="stats" ref={statsRef}>
        <div className="stat-card">
          <h1>{stats.yogis}K+</h1>
          <p>Happy Yogis</p>
        </div>

        <div className="stat-card">
          <h1>{stats.sessions}+</h1>
          <p>Daily Sessions</p>
        </div>

        <div className="stat-card">
          <h1>{stats.stress}%</h1>
          <p>Stress Reduced</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <h2 className="section-title reveal">What People Say</h2>
        <p className="section-subtitle reveal">
          Hear from our dedicated yoga family about their wellness transformations.
        </p>

        <div className="testimonial-grid">
          <div className="testimonial reveal">
            <p>
              “ZenFlow changed my life completely. The mental clarity and calm I
              experience daily is unparalleled.”
            </p>
            <h4>- Sarah M.</h4>
          </div>

          <div className="testimonial reveal">
            <p>
              “The blend of immersive visuals, smooth animations, and top-tier instructors
              makes every single session a joy.”
            </p>
            <h4>- David K.</h4>
          </div>
        </div>
      </section>

      {/* Community Voice Section (Supabase CRUD) */}
      <section className="community-section" id="community">
        <div className="community-container reveal">
          <h2 className="community-title">Community Voice</h2>
          <p className="community-desc">
            Vote on or request classes you want to see added next! Your input helps shape
            our session schedules.
          </p>

          {/* Form */}
          <form className="poll-form" onSubmit={addPoll}>
            <input
              type="text"
              className="poll-input"
              placeholder="Suggest a new class type or schedule..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit" className="poll-submit-btn">
              Suggest
            </button>
          </form>

          {/* List */}
          <div className="poll-list">
            {polls.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#a0aec0', padding: '20px 0' }}>
                No community requests yet. Be the first to suggest one! 🌸
              </div>
            ) : (
              polls.map((poll) => (
                <div className="poll-item" key={poll.id}>
                  {editingId === poll.id ? (
                    <div className="poll-edit-container">
                      <input
                        className="poll-edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <button className="action-btn save" onClick={() => updatePoll(poll.id)}>
                        Save
                      </button>
                      <button className="action-btn cancel" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="poll-text">{poll.question}</span>
                      <div className="poll-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            setEditingId(poll.id)
                            setEditText(poll.question)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deletePoll(poll.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>
          &copy; {new Date().getFullYear()} ZenFlow Yoga. All rights reserved. Recreated
          from original design.
        </p>
      </footer>

      {/* Floating Yoga Chatbot */}
      <ChatBot />
    </>
  )
}