'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

export type UserProfile = {
  name: string
  email: string
  role: UserRole
  avatar?: string
  streakDays?: number
  minutesMeditated?: number
  completedSessions?: number
}

export type ClassItem = {
  id: number
  title: string
  description: string
  category: 'Acro' | 'Vinyasa' | 'Hatha' | 'Kundalini' | 'Yin' | 'Restorative'
  instructor: string
  duration: string
  level: string
  image: string
  isActive: boolean
}

type AuthContextType = {
  user: UserProfile | null
  role: UserRole
  login: (email: string, role: UserRole, name?: string) => void
  logout: () => void
  enrolledClasses: number[]
  toggleEnrollClass: (classId: number) => void
  classesList: ClassItem[]
  addClass: (cls: Omit<ClassItem, 'id'>) => void
  updateClass: (id: number, updated: Partial<ClassItem>) => void
  deleteClass: (id: number) => void
}

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 1,
    title: 'Acro Yoga Flow',
    description: 'Improve your overall strength, stability, and mutual physical trust with partner-assisted flows.',
    category: 'Acro',
    instructor: 'Elena Rostova',
    duration: '45 mins',
    level: 'Intermediate',
    image: 'https://assets.ccbp.in/frontend/static-website/yoga-card1-img.png',
    isActive: true,
  },
  {
    id: 2,
    title: 'Vinyasa Energy Flow',
    description: 'Build stamina, increase flow rate, and release daily built-up stress through synchronized breathing.',
    category: 'Vinyasa',
    instructor: 'Marcus Vance',
    duration: '60 mins',
    level: 'All Levels',
    image: 'https://assets.ccbp.in/frontend/static-website/yoga-card2-img.png',
    isActive: true,
  },
  {
    id: 3,
    title: 'Hatha Posture & Alignment',
    description: 'Refine physical posture, structural alignment, and deep core stability with mindful holds.',
    category: 'Hatha',
    instructor: 'Aria Chen',
    duration: '50 mins',
    level: 'Beginner',
    image: 'https://assets.ccbp.in/frontend/static-website/yoga-card3-img.png',
    isActive: true,
  },
  {
    id: 4,
    title: 'Kundalini Awakening',
    description: 'Elevate spiritual awareness, cognitive focus, and active energy flows across chakras.',
    category: 'Kundalini',
    instructor: 'Devi Shanti',
    duration: '45 mins',
    level: 'Advanced',
    image: 'https://assets.ccbp.in/frontend/static-website/yoga-card4-img.png',
    isActive: true,
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole>('guest')
  const [enrolledClasses, setEnrolledClasses] = useState<number[]>([1, 2])
  const [classesList, setClassesList] = useState<ClassItem[]>(INITIAL_CLASSES)

  // Load stored state on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('zenflow_user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        setRole(parsed.role)
      }

      const storedEnrolled = localStorage.getItem('zenflow_enrolled')
      if (storedEnrolled) {
        setEnrolledClasses(JSON.parse(storedEnrolled))
      }

      const storedClasses = localStorage.getItem('zenflow_classes')
      if (storedClasses) {
        setClassesList(JSON.parse(storedClasses))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const login = (email: string, role: UserRole, name?: string) => {
    const defaultName = role === 'admin' ? 'Zen Admin Manager' : (name || email.split('@')[0])
    const profile: UserProfile = {
      name: defaultName,
      email,
      role,
      streakDays: role === 'user' ? 14 : 45,
      minutesMeditated: role === 'user' ? 320 : 1240,
      completedSessions: role === 'user' ? 24 : 88,
    }
    setUser(profile)
    setRole(role)
    try {
      localStorage.setItem('zenflow_user', JSON.stringify(profile))
    } catch (e) {
      console.error(e)
    }
  }

  const logout = () => {
    setUser(null)
    setRole('guest')
    try {
      localStorage.removeItem('zenflow_user')
    } catch (e) {
      console.error(e)
    }
  }

  const toggleEnrollClass = (classId: number) => {
    setEnrolledClasses((prev) => {
      const updated = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
      try {
        localStorage.setItem('zenflow_enrolled', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  const addClass = (cls: Omit<ClassItem, 'id'>) => {
    setClassesList((prev) => {
      const newClass = { ...cls, id: Date.now() }
      const updated = [newClass, ...prev]
      try {
        localStorage.setItem('zenflow_classes', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  const updateClass = (id: number, updatedFields: Partial<ClassItem>) => {
    setClassesList((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
      try {
        localStorage.setItem('zenflow_classes', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  const deleteClass = (id: number) => {
    setClassesList((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      try {
        localStorage.setItem('zenflow_classes', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        enrolledClasses,
        toggleEnrollClass,
        classesList,
        addClass,
        updateClass,
        deleteClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
