'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

// Static features list
const features = [
  {
    title: '1-Line Integration',
    desc: 'Embed across Next.js, Shopify, WordPress, or custom HTML with a lightweight script tag.',
    icon: (
      <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Full Knowledge Control',
    desc: 'Connect your FAQs, documents, or Notion pages. Restrict topics with fine-grained admin guardrails.',
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Always Active, Zero Latency',
    desc: 'Resolve 80%+ of repetitive queries 24/7 with sub-second response times and seamless human handoff.',
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

// Dummy chat showcase messages
const DUMMY_CONVERSATION = [
  {
    id: 1,
    sender: 'user',
    text: 'Do you offer cash on delivery & instant returns?',
    time: '2:14 PM',
  },
  {
    id: 2,
    sender: 'ai',
    text: 'Yes! Cash on Delivery is available across all serviceable pincodes, and return pickups are scheduled within 24 hours of request.',
    time: '2:14 PM',
  },
  {
    id: 3,
    sender: 'user',
    text: 'What are your support working hours?',
    time: '2:15 PM',
  },
  {
    id: 4,
    sender: 'ai',
    text: 'Our human support team is available Monday to Saturday, 9:00 AM to 8:00 PM IST. Our AI assistant is active 24/7!',
    time: '2:15 PM',
  },
]

function HomeClient({ email }: { email?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Dropdown outside click handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true)
      await axios.get('/api/auth/logout')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const firstLetter = email ? email[0].toUpperCase() : ''

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white overflow-x-hidden font-sans">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-200/40 via-sky-200/40 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[35rem] -left-40 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/75 backdrop-blur-md border-b border-zinc-200/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition">
              S
            </div>
            <div className="text-lg font-semibold tracking-tight text-zinc-950">
              Servora <span className="font-normal text-zinc-400">AI</span>
            </div>
          </Link>

          {/* Header Action Items */}
          <div className="flex items-center gap-3">
            {/* Documentation Button */}
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 transition"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Docs
            </Link>

            {email ? (
              <div ref={popupRef} className="relative">
                <button
                  type="button"
                  aria-label="User Menu"
                  className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium shadow-md hover:ring-2 hover:ring-zinc-400 hover:ring-offset-2 transition-all cursor-pointer"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {firstLetter}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-1.5 overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 text-xs text-zinc-400 border-b border-zinc-100 truncate">
                        {email}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          router.push('/dashboard')
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 text-zinc-700 transition font-medium cursor-pointer"
                      >
                        Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={handleLogOut}
                        disabled={isLoggingOut}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition font-medium disabled:opacity-50 cursor-pointer"
                      >
                        {isLoggingOut ? 'Logging out...' : 'Log Out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="px-5 py-2 rounded-full bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition active:scale-95 shadow-sm cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Next-Gen Autonomous Agent Engine
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
              Customer support that runs on your knowledge.
            </h1>

            <p className="text-lg text-zinc-600 leading-relaxed max-w-xl">
              Turn your docs, guides, and FAQs into a 24/7 AI representative that answers questions, resolves issues, and converts visitors in seconds.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={email ? () => router.push('/dashboard') : handleLogin}
                className="px-7 py-3.5 rounded-xl bg-zinc-950 text-white font-medium hover:bg-zinc-800 transition shadow-sm active:scale-95 cursor-pointer"
              >
                {email ? 'Go to Dashboard →' : 'Deploy for Free →'}
              </button>

              <Link
                href="/docs"
                className="px-6 py-3.5 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-sm inline-flex items-center gap-1.5"
              >
                Read Docs
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-zinc-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-bold text-zinc-900">&lt; 200ms</p>
                <p className="text-xs text-zinc-500 mt-0.5">Average Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">85%</p>
                <p className="text-xs text-zinc-500 mt-0.5">Deflection Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">1 Line</p>
                <p className="text-xs text-zinc-500 mt-0.5">Setup Code</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dummy Preview Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl transform -rotate-1" />

            <div className="relative rounded-2xl bg-white shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col h-[470px]">
              {/* Card Header */}
              <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-semibold">
                      AI
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 leading-none">Servora Assistant</h3>
                    <p className="text-[11px] text-zinc-400 mt-1">Autonomous Support Agent</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                  Preview Demo
                </span>
              </div>

              {/* Chat Message Window */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gradient-to-b from-white to-zinc-50/40">
                {DUMMY_CONVERSATION.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-zinc-900 text-white rounded-br-xs'
                          : 'bg-white text-zinc-800 rounded-bl-xs border border-zinc-200/80 shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.time}</span>
                  </motion.div>
                ))}
              </div>

              {/* Dummy Footer (No Send Button, Lock Banner) */}
              <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Interactive chat simulator dashboard me active hai</span>
                </div>

                <button
                  type="button"
                  onClick={email ? () => router.push('/dashboard') : handleLogin}
                  className="text-xs font-semibold text-zinc-950 hover:text-zinc-700 transition cursor-pointer shrink-0"
                >
                  {email ? 'Open Dashboard →' : 'Sign in to Test →'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6 bg-white border-t border-zinc-200/80">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Why fast-growing teams choose Servora
            </h2>
            <p className="text-zinc-600 text-base">
              Set up in under 5 minutes without writing custom ML models or complex backend pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="group p-8 rounded-2xl bg-zinc-50 border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-100/50 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">{f.title}</h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modernized Footer */}
      <footer className="py-12 border-t border-zinc-200 bg-zinc-50 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; 2026 ServoraAI. Built for high-conversion stores &amp; SaaS.
          </p>

          {/* Clean Dummy Status & Docs */}
          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
            <span className="font-mono text-zinc-400">v1.2.4-prod</span>
            <Link href="/docs" className="hover:text-zinc-900 transition font-medium">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeClient