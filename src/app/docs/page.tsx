'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

interface CodeBlockProps {
  code: string
  language?: string
}

function CodeBlock({ code, language = 'html' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/70 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
        <span>{language.toUpperCase()}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-white transition flex items-center gap-1 cursor-pointer"
        >
          {copied ? (
            <span className="text-emerald-400 font-medium">Copied! ✓</span>
          ) : (
            <span>Copy</span>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'quickstart', title: '2. Quickstart' },
  { id: 'platforms', title: '3. Platform Guides' },
  { id: 'knowledge-base', title: '4. Knowledge Base & Grounding' },
  { id: 'api-reference', title: '5. API Reference' },
  { id: 'faq', title: '6. Troubleshooting & FAQs' },
]

export default function DocsPage() {
  const [activePlatform, setActivePlatform] = useState<'html' | 'nextjs' | 'react' | 'shopify'>('html')

  const platformSnippets = {
    html: `<!-- Add this right before your closing </body> tag -->
<script
  src="https://your-domain.com/chatbot.js"
  data-owner-id="usr_your_unique_owner_id"
  defer
></script>`,

    nextjs: `// In your app/layout.tsx (Next.js App Router)
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://your-domain.com/chatbot.js"
          data-owner-id="usr_your_unique_owner_id"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}`,

    react: `// In your public/index.html or root component useEffect
import { useEffect } from 'react'

export function ChatbotWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://your-domain.com/chatbot.js'
    script.setAttribute('data-owner-id', 'usr_your_unique_owner_id')
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}`,

    shopify: `<!-- In Shopify Admin > Online Store > Themes > Edit Code -->
<!-- Open 'layout/theme.liquid' and paste before </body> -->

<script
  src="https://your-domain.com/chatbot.js"
  data-owner-id="usr_your_unique_owner_id"
  defer
></script>`,
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              S
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950">
              Servora <span className="font-normal text-zinc-400">AI</span>
            </span>
            <span className="ml-2 text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              Documentation
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition shadow-xs"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Documentation Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Sticky Sidebar Navigation */}
        <aside className="lg:col-span-3 sticky top-24 self-start hidden lg:block">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 pb-1">
              Table of Contents
            </p>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Main Content Body */}
        <main className="lg:col-span-9 space-y-16">
          {/* Section 1: Overview */}
          <section id="overview" className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
              Servora AI Documentation
            </h1>
            <p className="text-base text-zinc-600 leading-relaxed">
              Servora AI is a plug-and-play autonomous customer support agent. It connects to your business policies, FAQs, and delivery rules, resolving customer queries in under 300ms without hallucinating unverified promises.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="text-sm font-semibold text-zinc-900">Zero Build Friction</div>
                <p className="text-xs text-zinc-500 mt-1">One static script tag embeds across all web stacks.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="text-sm font-semibold text-zinc-900">Strict Knowledge Guardrails</div>
                <p className="text-xs text-zinc-500 mt-1">Answers only from your provided information; escalates unknowns.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="text-sm font-semibold text-zinc-900">Sub-Second Inferences</div>
                <p className="text-xs text-zinc-500 mt-1">Powered by ultra-fast LLM engines via Groq and Gemini.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Quickstart */}
          <section id="quickstart" className="space-y-4 pt-4 border-t border-zinc-200/80">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">2. Quickstart (Under 2 Minutes)</h2>
            <p className="text-sm text-zinc-600">
              Integrating the widget into any live website takes three steps:
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Configure your Store</h4>
                  <p className="text-xs text-zinc-500">Go to your dashboard, enter your store name, escalation email, and paste your return/shipping policies.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Get your Owner ID</h4>
                  <p className="text-xs text-zinc-500">Click <strong>Embed Chatbot</strong> in the dashboard navigation bar to retrieve your unique snippet.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Paste the Script</h4>
                  <p className="text-xs text-zinc-500">Paste the script tag directly before the closing <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag of your website.</p>
                </div>
              </div>
            </div>

            <CodeBlock
              language="html"
              code={`<!-- Servora AI Widget -->
<script
  src="http://localhost:3000/chatbot.js"
  data-owner-id="usr_your_owner_id"
  defer
></script>`}
            />
          </section>

          {/* Section 3: Platform Guides */}
          <section id="platforms" className="space-y-4 pt-4 border-t border-zinc-200/80">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">3. Platform Integration Guides</h2>
            <p className="text-sm text-zinc-600">
              Select your front-end framework or CMS to view tailored installation steps:
            </p>

            {/* Platform Selector Tabs */}
            <div className="flex gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
              {(['html', 'nextjs', 'react', 'shopify'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivePlatform(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    activePlatform === tab
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {tab === 'nextjs' ? 'Next.js' : tab}
                </button>
              ))}
            </div>

            <CodeBlock
              language={activePlatform === 'nextjs' ? 'tsx' : activePlatform === 'react' ? 'tsx' : 'html'}
              code={platformSnippets[activePlatform]}
            />
          </section>

          {/* Section 4: Knowledge Base & Grounding */}
          <section id="knowledge-base" className="space-y-4 pt-4 border-t border-zinc-200/80">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">4. Knowledge Base &amp; Grounding</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Servora uses deterministic context grounding. The AI assistant strictly restricts its answers to what you provide in your dashboard.
            </p>

            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900">Recommended Structuring Format</h3>
              <p className="text-xs text-zinc-500">
                For optimal accuracy, format your knowledge base using bullet points categorized by topic:
              </p>

              <div className="bg-zinc-50 p-4 rounded-lg font-mono text-xs text-zinc-800 leading-relaxed border border-zinc-200">
                - Shipping: Free delivery above ₹999. Arrives within 3-5 business days.<br />
                - Returns: 7-day hassle-free replacement or full refund.<br />
                - Payments: UPI, Credit/Debit cards, Net Banking, and COD.<br />
                - Support Timings: Monday to Saturday, 9:00 AM to 8:00 PM IST.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-semibold">Automatic Fallback Escalation:</p>
              <p>
                If a customer asks a query not covered by your text (e.g., &ldquo;Do you sell international flight tickets?&rdquo;), the bot does not invent answers. It responds by politely asking the user to reach out to your escalation support email.
              </p>
            </div>
          </section>

          {/* Section 5: API Reference */}
          <section id="api-reference" className="space-y-4 pt-4 border-t border-zinc-200/80">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">5. API Reference</h2>
            <p className="text-sm text-zinc-600">
              Integrate Servora directly with your own headless backend using our REST endpoints.
            </p>

            <div className="space-y-6">
              {/* Endpoint 1 */}
              <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-100 text-blue-700">POST</span>
                  <code className="text-sm font-mono font-semibold text-zinc-900">/api/chat</code>
                </div>
                <p className="text-xs text-zinc-600">Sends a user message and returns an autonomous grounded response.</p>

                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider pt-2">Request Body</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "ownerId": "usr_150933493654750210",
  "message": "What is your refund policy?"
}`}
                />

                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider pt-2">Response (200 OK)</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "reply": "We offer a 7-day hassle-free return window with pickup scheduled in 24 hours."
}`}
                />
              </div>

              {/* Endpoint 2 */}
              <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-100 text-emerald-700">GET / POST</span>
                  <code className="text-sm font-mono font-semibold text-zinc-900">/api/settings</code>
                </div>
                <p className="text-xs text-zinc-600">Get or update the business details and knowledge base for a specific owner.</p>
              </div>
            </div>
          </section>

          {/* Section 6: FAQ */}
          <section id="faq" className="space-y-4 pt-4 border-t border-zinc-200/80">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">6. Troubleshooting &amp; FAQs</h2>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
                <h3 className="text-sm font-semibold text-zinc-900">Why does the widget say &ldquo;Chatbot is not configured yet&rdquo;?</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  This happens if no settings record exists for your <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">ownerId</code>. Open your dashboard, enter your store name, click <strong>Save Changes</strong>, and refresh your external site.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
                <h3 className="text-sm font-semibold text-zinc-900">Does this script slow down my site's Google Lighthouse score?</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  No. The script uses the <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">defer</code> attribute and loads asynchronously after your primary DOM tree has fully finished painting.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
                <h3 className="text-sm font-semibold text-zinc-900">How do I handle Cross-Origin Resource Sharing (CORS) errors?</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  The <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">/api/chat</code> endpoint includes wildcard <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">Access-Control-Allow-Origin: *</code> headers by default, allowing it to respond to requests from any domain where the script is embedded.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}