import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Globe,
  Layers,
  ArrowRight,
  Check,
  ChevronDown,
  Zap,
  MapPin,
  Presentation,
  Users2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ease } from '../lib/animations.js';

// ─── Sub-components ─────────────────────────────────────────────────────────

const Feature = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -3, transition: { duration: 0.18, ease: ease.out } }}
    className="p-6 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3 hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-950/20 transition-colors"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="font-semibold text-gray-100 text-base">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Step = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
      {number}
    </div>
    <div>
      <h4 className="font-semibold text-gray-100 mb-1">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#222E42]">
      <button
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: ease.out }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: ease.out }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Dashboard Mockup ────────────────────────────────────────────────────────
const DashboardMockup = () => (
  <div className="relative mx-auto max-w-2xl">
    <div className="bg-[#151D2A] border border-[#222E42] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
      {/* Fake top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222E42] bg-[#0B1220]">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-2 text-xs text-gray-500 font-mono">burnly.app/dashboard</span>
      </div>
      {/* Fake metric cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Cash Runway', value: '18 mo', color: 'text-blue-400' },
            { label: 'Break-Even', value: 'Mo 14', color: 'text-emerald-400' },
            { label: 'Net Burn', value: '₹51k', color: 'text-rose-400' },
            { label: 'Risk Score', value: '42/100', color: 'text-amber-400' },
          ].map((m) => (
            <div key={m.label} className="bg-[#0E1420] border border-[#222E42] rounded-lg p-3">
              <p className="text-[9px] text-gray-500 uppercase font-semibold mb-1">{m.label}</p>
              <p className={`text-base font-extrabold font-mono ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
        {/* Fake chart */}
        <div className="bg-[#0E1420] border border-[#222E42] rounded-lg p-3 h-32 flex items-end gap-1">
          {[40, 55, 50, 45, 38, 30, 22, 15, 8, 3, 0, 0].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="rounded-sm"
                style={{
                  height: `${Math.max(4, h)}%`,
                  background: h > 20 ? '#3B82F6' : '#EF4444',
                  opacity: 0.7 + i * 0.025,
                }}
              />
            </div>
          ))}
        </div>
        {/* Fake table rows */}
        {['Month 1', 'Month 2', 'Month 3'].map((m, i) => (
          <div key={m} className="flex items-center justify-between text-xs border-b border-[#222E42]/50 pb-2">
            <span className="text-gray-400">{m}</span>
            <span className="text-emerald-400 font-mono">₹{(25000 + i * 2000).toLocaleString()}</span>
            <span className="text-rose-400 font-mono">₹{(76000 + i * 500).toLocaleString()}</span>
            <span className="text-gray-300 font-mono">₹{((1500000 - i * 51000)).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Glow effect */}
    <div className="absolute -inset-4 -z-10 bg-blue-600/10 blur-2xl rounded-3xl" />
  </div>
);

// ─── Main Landing Page ───────────────────────────────────────────────────────
export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) navigate('/dashboard');
    else navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#E8EAF0]">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur-sm border-b border-[#222E42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Burnly</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 border border-blue-800/60 rounded-full text-xs text-blue-300 font-medium">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Financial Intelligence for Startups
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Know exactly when{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  you'll run out
                </span>{' '}
                of cash.
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                Burnly turns your startup's financials into a 36-month simulation, showing cash runway, break-even points, risk scores, and AI-generated intelligence reports — all in real time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-base"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-[#151D2A] hover:bg-[#1A2436] border border-[#222E42] text-gray-200 font-medium px-6 py-3 rounded-xl transition-colors text-base"
                >
                  Explore Features
                </a>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Free to use</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Save your models</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Everything your startup's finances need</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              From real-time simulation to AI intelligence — Burnly covers every financial dimension of running a startup.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature
              icon={BarChart3}
              title="Financial Simulator"
              description="Model starting cash, payroll, marketing, infrastructure, and hiring timelines. See 36-month projections update as you type."
              color="bg-blue-950/60 text-blue-400"
            />
            <Feature
              icon={Clock}
              title="Cash Runway Tracker"
              description="Instantly know how many months until your cash hits zero. Visualize the exact moment the runway ends."
              color="bg-indigo-950/60 text-indigo-400"
            />
            <Feature
              icon={TrendingUp}
              title="Break-Even Analysis"
              description="Calculate the exact month your revenue covers all expenses. Simulate different growth rate scenarios."
              color="bg-emerald-950/60 text-emerald-400"
            />
            <Feature
              icon={Layers}
              title="Scenario Comparison"
              description="Create multiple financial scenarios — seed stage, bootstrapped, aggressive — and compare them side by side."
              color="bg-cyan-950/60 text-cyan-400"
            />
            <Feature
              icon={ShieldAlert}
              title="Risk Intelligence"
              description="Composite risk scoring based on runway, burn ratio, and break-even timeline. Get actionable risk mitigation recommendations."
              color="bg-rose-950/60 text-rose-400"
            />
            <Feature
              icon={Globe}
              title="AI Market Research"
              description="Generate TAM/SAM/SOM sizing, competitor maps, pitch outlines, and roadmaps — all powered by Gemini AI with your financial data."
              color="bg-violet-950/60 text-violet-400"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How Burnly works</h2>
            <p className="text-gray-400 mt-3">From setup to insight in minutes.</p>
          </div>
          <div className="space-y-8">
            <Step
              number="1"
              title="Create your startup profile"
              description="Enter your venture's name, industry, stage, team size, and business model. This context powers all intelligence reports."
            />
            <Step
              number="2"
              title="Input your financial model"
              description="Set starting cash, monthly revenue, growth rate, payroll, marketing, infrastructure costs, and your hiring plan."
            />
            <Step
              number="3"
              title="See your runway in real time"
              description="Burnly instantly runs a 36-month simulation showing cash balance, break-even point, net burn, and risk score as you type."
            />
            <Step
              number="4"
              title="Generate AI intelligence reports"
              description="Sign up and generate market research, competitor maps, execution roadmaps, pitch outlines, and risk analysis powered by Gemini AI."
            />
          </div>
        </div>
      </section>

      {/* ── Intelligence Modules ── */}
      <section className="py-20 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">AI Intelligence Modules</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Every report is grounded in your actual financial data — not generic advice.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Globe, label: 'Market Intel', desc: 'TAM, SAM, SOM + trends', color: 'text-blue-400' },
              { icon: Users2, label: 'Competitors', desc: 'Mapping & gaps', color: 'text-indigo-400' },
              { icon: MapPin, label: 'Roadmap', desc: 'Runway-driven milestones', color: 'text-cyan-400' },
              { icon: Presentation, label: 'Pitch Outline', desc: '8-slide investor deck', color: 'text-violet-400' },
              { icon: ShieldAlert, label: 'Risk Matrix', desc: 'Severity × likelihood', color: 'text-rose-400' },
            ].map((m) => (
              <div key={m.label} className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl text-center space-y-3 hover:border-blue-800/40 transition-colors">
                <m.icon className={`w-7 h-7 mx-auto ${m.color}`} />
                <div>
                  <p className="font-semibold text-gray-100 text-sm">{m.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently asked questions</h2>
          </div>
          <div className="bg-[#151D2A] border border-[#222E42] rounded-xl px-6">
            <FaqItem
              question="Is Burnly free to use?"
              answer="Yes. The financial simulator, projections, and scenario comparison tools are completely free. AI intelligence reports (market, competitors, roadmap, pitch, risk) require a free account and a valid Gemini API key configured in the backend."
            />
            <FaqItem
              question="How accurate are the financial projections?"
              answer="Projections are deterministic calculations based on the inputs you provide. They are only as accurate as your inputs. Burnly shows you the mathematical output of your assumptions — not a prediction of the future."
            />
            <FaqItem
              question="Are AI reports financial advice?"
              answer="No. AI-generated intelligence reports are planning aids that combine your financial data with Gemini AI reasoning. They do not constitute financial, legal, tax, or investment advice. Always consult qualified advisors before making capital decisions."
            />
            <FaqItem
              question="Is my financial data secure?"
              answer="Your data is stored in your own MongoDB database and protected by JWT authentication. For AI reports, non-sensitive startup profile context is sent to the Google Gemini API — your personal credentials are never transmitted."
            />
            <FaqItem
              question="Can I model multiple scenarios?"
              answer="Yes. You can create and save multiple financial scenarios (e.g. optimistic, conservative, aggressive) and compare them side by side on the Compare page."
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-[#0B1220]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Start modeling your runway today</h2>
          <p className="text-gray-400">
            No credit card. No fluff. Just honest financial clarity for your startup.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#222E42] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">Burnly</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-gray-300 transition-colors">Get Started</Link>
              <span>© 2025 Burnly. Financial planning tool for startups.</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-6">
            Burnly is a financial planning simulator. All projections are mathematical outputs of your inputs and do not constitute financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};
