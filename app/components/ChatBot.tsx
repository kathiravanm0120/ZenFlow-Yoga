'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to ZenFlow Yoga. I am your mindful AI guide. How can I assist you on your path to wellness and inner peace today? 🧘✨'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    "What classes are offered?",
    "How does yoga reduce stress?",
    "What is the Community Voice?",
    "Tell me about Acro Yoga"
  ]

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Keep only last 10 messages for context size economy
      const chatHistory = [...messages, userMessage].slice(-10)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      })

      if (!response.ok) {
        throw new Error('Response failed')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch (error) {
      console.error('Chat API Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'My apologies. The signal became cloud-like and floated away. Please take a deep breath and try asking your question again. 🌬️'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="zen-chatbot-container">
      {/* Chat Window Panel */}
      <div className={`zen-chat-window ${isOpen ? 'open' : ''}`}>
        {/* Chat Header */}
        <div className="zen-chat-header">
          <div className="zen-chat-header-info">
            <div className="zen-chat-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lotus-svg">
                <path d="M12 2c1.5 3 3.5 3 5.5 3s3-1.5 3-3-1.5-3-3-3-4 1-5.5 3z" />
                <path d="M12 2c-1.5 3-3.5 3-5.5 3s-3-1.5-3-3 1.5-3 3-3 4 1 5.5 3z" />
                <path d="M12 10c2 4 4 4 6 4s3-2 3-4-2-4-4-4-5 1.5-5 4z" />
                <path d="M12 10c-2 4-4 4-6 4s-3-2-3-4 2-4 4-4 5 1.5 5 4z" />
                <path d="M12 22c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5z" />
              </svg>
              <span className="online-indicator"></span>
            </div>
            <div>
              <h3>ZenFlow Guide</h3>
              <p>Mindful AI Companion</p>
            </div>
          </div>
          <button className="zen-chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Message Panel */}
        <div className="zen-chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`zen-message-wrapper ${msg.role}`}>
              <div className="zen-message-bubble">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="zen-message-wrapper assistant">
              <div className="zen-message-bubble loading">
                <div className="zen-breathing-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="loader-text">Meditating on a response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Section */}
        {messages.length === 1 && (
          <div className="zen-chat-suggestions">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="zen-chat-input-form">
          <input
            type="text"
            className="zen-chat-input"
            placeholder="Ask about yoga or this page..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="zen-chat-send-btn" disabled={!input.trim() || isLoading} aria-label="Send Message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`zen-chat-toggle-btn ${isOpen ? 'active' : ''}`}
        aria-label="Toggle Yoga Assistant"
      >
        <span className="glow-effect"></span>
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  )
}
