'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

function HomeClient({ email }: { email: string }) {
  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  const firstLetter = email ? email[0].toUpperCase() : ''
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Close dropdown when clicking outside
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden'>
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
      >
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='text-lg font-semibold tracking-tight'>
            Servora <span className='text-zinc-400'>AI</span>
          </div>

          {email ? (
            <div ref={popupRef} className='relative'>
              <button
                className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:scale-105 transition'
                onClick={() => setOpen((prev) => !prev)}
              >
                {firstLetter}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className='absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden'
                  >
                    <button className='w-full text-left px-4 py-3 text-sm hover:bg-zinc-100'>
                      Dashboard
                    </button>
                    <button className='w-full text-left px-4 py-3 text-sm hover:bg-zinc-100 text-red-600'>
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className='px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 flex items-center gap-2'
            >
              Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HomeClient