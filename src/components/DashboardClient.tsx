'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Message {
  id: string | number
  sender: 'user' | 'bot'
  text: string
  time?: string
}

const TEMPLATES = [
  {
    name: 'E-commerce',
    text: `- Delivery: Free shipping on orders above ₹999. Usually delivers in 3-5 days.
- Return/Refund: 7-day hassle-free returns. Pickup scheduled within 24 hours.
- Payment: UPI, Cards, NetBanking, and Cash on Delivery (COD) available.
- Support Hours: Mon-Sat, 9:00 AM to 8:00 PM.`,
  },
  {
    name: 'SaaS Platform',
    text: `- Pricing: Free trial for 14 days, no credit card required. Pro plan starts at ₹1,499/mo.
- Cancellation: Cancel anytime directly from billing settings.
- Security: SOC2 compliant with 256-bit AES database encryption.
- Integration: REST APIs, Webhooks, and Zapier support available.`,
  },
  {
    name: 'Services & Agencies',
    text: `- Consultation: Initial 30-min discovery call is 100% free.
- Turnaround: Project kickoff within 48 hours of onboarding.
- Revisions: Up to 3 complimentary revision rounds on all deliverables.
- Invoicing: 50% upfront deposit, 50% upon milestone completion.`,
  },
]

const QUICK_TEST_PROMPTS = [
  'What is your return policy?',
  'How long does shipping take?',
  'What are your support hours?',
  'Hello! How can you help me?',
]

function DashboardClient({ ownerId }: { ownerId: string }) {
  const router = useRouter()

  // Form State
  const [businessName, setBusinessName] = useState('My Store')
  const [supportEmail, setSupportEmail] = useState('support@domain.com')
  const [welcomeMessage, setWelcomeMessage] = useState('Hi there! How can I help you today?')
  const [knowledgeBase, setKnowledgeBase] = useState(TEMPLATES[0].text)

  // UI Interactive States
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isEmbedOpen, setIsEmbedOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Chat Preview State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: 'initial-welcome', sender: 'bot', text: 'Hi there! How can I help you today?', time: 'Just now' },
  ])
  const [previewInput, setPreviewInput] = useState('')
  const [isBotReplying, setIsBotReplying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isBotReplying])

  // 1. Fetch saved settings from DB on page load
  useEffect(() => {
    async function loadSettings() {
      if (!ownerId) return
      try {
        const res = await fetch(`/api/settings?ownerId=${ownerId}`)
        const data = await res.json()
        if (data.success && data.setting) {
          setBusinessName(data.setting.businessName || 'My Store')
          setSupportEmail(data.setting.supportEmail || 'support@domain.com')
          if (data.setting.knowledge) {
            setKnowledgeBase(data.setting.knowledge)
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    loadSettings()
  }, [ownerId])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 2. Real Save to Database
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId,
          businessName,
          supportEmail,
          knowledge: knowledgeBase,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Settings saved & chatbot synced!')
      } else {
        showToast(data.message || 'Failed to save settings')
      }
    } catch (err) {
      console.error('Error saving settings:', err)
      showToast('Network error while saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Real Live AI Chat Call (/api/chat)
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || previewInput).trim()
    if (!text || isBotReplying) return

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages((prev) => [...prev, userMsg])
    setPreviewInput('')
    setIsBotReplying(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId,
          message: text,
        }),
      })

      const data = await res.json()
      const botReply = data.reply || data.message || "I couldn't process your request."

      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setChatMessages((prev) => [...prev, botMsg])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Unable to reach AI assistant. Please check your network connection.',
          time: 'Now',
        },
      ])
    } finally {
      setIsBotReplying(false)
    }
  }

  const embedCodeSnippet = `<!-- Servora AI Widget -->
<script
  src="https://servora-ai-olive.vercel.app/chatbot.js"
  data-owner-id="${ownerId || 'your-owner-id'}"
  defer
></script>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/80"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              S
            </div>
            <div className="text-lg font-semibold tracking-tight text-zinc-950">
              Servora <span className="font-normal text-zinc-400">AI</span>
            </div>
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Embed Chatbot
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition active:scale-95 disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 right-8 z-50 flex items-center gap-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium"
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Settings Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Chatbot Settings</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Configure your autonomous agent's rules, brand identity, and support knowledge.
              </p>
            </div>

            {/* Business Details Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 text-zinc-900 font-semibold text-base">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Profile
                </div>
                {isLoadingSettings && (
                  <span className="text-xs text-zinc-400 animate-pulse font-medium">Loading details...</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Store"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Escalation Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@yourbrand.com"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700">Welcome Message</label>
                <input
                  type="text"
                  value={welcomeMessage}
                  onChange={(e) => {
                    setWelcomeMessage(e.target.value)
                    setChatMessages((prev) =>
                      prev.length ? [{ ...prev[0], text: e.target.value }, ...prev.slice(1)] : []
                    )
                  }}
                  placeholder="Greeting shown to customers"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Knowledge Base Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 text-zinc-900 font-semibold text-base">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Knowledge Base & Guardrails
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {knowledgeBase.length} characters
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 mb-2">Load Starter Templates:</p>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => {
                        setKnowledgeBase(tmpl.text)
                        showToast(`Loaded ${tmpl.name} template. Click "Save Changes" to apply.`)
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-white text-zinc-700 transition cursor-pointer font-medium"
                    >
                      + {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Instructions, Store Policies & Answers
                </label>
                <textarea
                  rows={8}
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  placeholder="Paste return policies, FAQs, shipping times, or business hours..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-sm text-zinc-900 font-mono leading-relaxed placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition resize-y"
                />
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 text-xs text-zinc-500 flex items-start gap-2">
                <span className="text-amber-500 font-bold">💡 Tip:</span>
                <span>
                  Store policies edit karne ke baad pehle <b>Save Changes</b> dabayein, uske baad right side simulator me test karein.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Chat Simulator */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl overflow-hidden flex flex-col h-[580px]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-semibold">
                      {businessName ? businessName[0].toUpperCase() : 'S'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 leading-none">
                      {businessName || 'Servora Assistant'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1">Live Groq AI Sandbox</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setChatMessages([{ id: Date.now(), sender: 'bot', text: welcomeMessage, time: 'Just now' }])
                  }
                  className="text-xs text-zinc-500 hover:text-zinc-900 underline transition cursor-pointer"
                >
                  Reset Chat
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-white to-zinc-50/40">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-zinc-900 text-white rounded-br-sm'
                          : 'bg-zinc-100 text-zinc-800 rounded-bl-sm border border-zinc-200/60'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.time && (
                      <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.time}</span>
                    )}
                  </motion.div>
                ))}

                {isBotReplying && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-zinc-100 rounded-2xl px-4 py-2 text-zinc-500 text-xs flex items-center gap-1.5 border border-zinc-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Testing Chips */}
              <div className="px-3 py-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_TEST_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isBotReplying}
                    onClick={() => handleSendMessage(prompt)}
                    className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition cursor-pointer disabled:opacity-40 shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="p-3 bg-white border-t border-zinc-100 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Test your bot with a customer question..."
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!previewInput.trim() || isBotReplying}
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-40 transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Chatbot Modal */}
      <AnimatePresence>
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Embed on your Website</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Paste this snippet before the closing &lt;/body&gt; tag of your site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmbedOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                  {embedCodeSnippet}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition cursor-pointer shadow-sm"
                >
                  {copied ? 'Copied! ✓' : 'Copy Code'}
                </button>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200/80 p-3 text-xs text-zinc-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Works seamlessly with Next.js, Shopify, WordPress, Webflow, and plain HTML.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardClient