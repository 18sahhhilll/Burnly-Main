import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  ArrowRight,
  Check,
  ChevronDown,
  Zap,
  ShieldCheck,
  Sparkles,
  BarChart2,
  TrendingUp,
  Clock,
  Layers,
  Award,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLenis } from '../hooks/useLenis.js';
import { IMAGES } from '../lib/images.js';
import { HeroDashboardMockup } from '../components/landing/HeroDashboardMockup.jsx';
import { RunwayCalculatorDemo } from '../components/landing/RunwayCalculatorDemo.jsx';
import { BentoFeatures } from '../components/landing/BentoFeatures.jsx';
import { Reveal } from '../components/landing/Reveal.jsx';

// ─── FAQ Accordion Item ────────────────────────────────────────────────────────
const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs sm:text-sm text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize smooth scrolling
  useLenis();

  // Navbar translucent scroll state
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) navigate('/dashboard');
    else navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E8EAF0] relative overflow-hidden bg-grid-pattern">
      {/* Aurora Ambient Glow Layer */}
      <div className="aurora-bg" />

      {/* ─── Sticky Translucent Navbar ─────────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#080C14]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30 py-3'
            : 'bg-transparent border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight font-heading">
              Burnly
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Calculator</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-900/30 active:scale-95"
              >
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-300 hover:text-white transition-colors px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-900/30 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs text-blue-300 font-mono shadow-inner"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Deterministic 36-Month Runway Simulation
              </motion.div>

              {/* Sequential Headline Words with Italic Serif Accent */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
                Know{' '}
                <span className="font-serif italic text-blue-400 font-normal underline decoration-blue-500/30 decoration-wavy">
                  precisely
                </span>{' '}
                when your startup will run out of cash.
              </h1>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Burnly transforms complex startup headcount, revenue compounding, and operational expenses into an interactive 36-month simulation — with break-even timing and AI intelligence reports.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm shadow-xl shadow-blue-900/30 active:scale-95 cursor-pointer"
                >
                  Model Your Runway Free <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 bg-[#131B2E] hover:bg-[#1A2436] border border-white/10 text-gray-200 font-medium px-6 py-3.5 rounded-xl transition-all text-sm active:scale-95 cursor-pointer"
                >
                  Try Live Calculator
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Mathematical accuracy
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Save multiple scenarios
                </span>
              </div>
            </div>

            {/* Right Interactive Mockup (6 cols) */}
            <div className="lg:col-span-6">
              <HeroDashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Seed Syndicates Strip ──────────────────────────────── */}
      <section className="py-10 border-y border-white/5 bg-[#0B101C]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-6">
            Trusted by founders modeled after top accelerator standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
            {IMAGES.investors.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-blue-400">
                  {item.symbol}
                </span>
                <span className="text-xs font-semibold tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive Runway Calculator Demo Section ────────────────────────── */}
      <section id="demo" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Instant Runway Calculation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              How long will your cash last?
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
              Simulate your startup's cash runway below in real time.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <RunwayCalculatorDemo />
          </Reveal>
        </div>
      </section>

      {/* ─── Bento Grid Features Section ───────────────────────────────────────── */}
      <section id="features" className="py-24 bg-[#060910]/80 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Built For Startup Founders
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              Complete Financial Runway Architecture
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
              Ditch fragile spreadsheets. Burnly combines deterministic forecasting with generative market intelligence.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <BentoFeatures />
          </Reveal>
        </div>
      </section>

      {/* ─── How It Works (3 Steps) ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Streamlined Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              How Burnly works in 3 steps
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 h-full border border-white/10 hover:border-blue-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-bold text-blue-400 text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Input Financial Baseline
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Enter your starting cash reserve, monthly revenue, growth rate, and recurring fixed expenses (cloud, ops, founder salary).
                </p>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={0.2}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 h-full border border-white/10 hover:border-indigo-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-400 text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Model Future Headcount
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Add planned engineering, marketing, and sales hires by start month. The simulation engine recalculates runway depletion live.
                </p>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={0.3}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 h-full border border-white/10 hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Generate AI Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Receive TAM/SAM/SOM market sizing, competitor positioning matrices, and an 8-slide investor pitch deck tied to your verified numbers.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Founder Testimonials ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-[#060910]/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Founder Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              Clarity over financial anxiety
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between h-full border border-white/10">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Burnly showed us our hiring plan would trigger zero-cash in month 11 instead of month 18. We adjusted start dates before extending offers, saving us from an emergency bridge round."
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={IMAGES.avatars.founder1}
                    alt="Priya Sharma"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-white/10 bg-[#151D2A] shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Priya Sharma</h4>
                    <p className="text-[11px] text-gray-400">Co-founder & CEO, PayFlow (Seed)</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Testimonial 2 */}
            <Reveal delay={0.2}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between h-full border border-white/10">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Our investors loved the deterministic break-even timeline. Instead of a messy 15-tab Excel spreadsheet, we presented clean Burnly scenarios during our Series A diligence."
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={IMAGES.avatars.founder2}
                    alt="Arun Patel"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-white/10 bg-[#151D2A] shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Arun Patel</h4>
                    <p className="text-[11px] text-gray-400">Founder, CloudGrid AI</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Testimonial 3 */}
            <Reveal delay={0.3}>
              <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between h-full border border-white/10">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "The pitch deck outline feature alone was worth creating an account. It pulls our actual gross margin and monthly burn directly into the 8 slides without hallucinations."
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={IMAGES.avatars.founder3}
                    alt="Elena Rostova"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-white/10 bg-[#151D2A] shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                    <p className="text-[11px] text-gray-400">Managing Partner, NextWave Ventures</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Pricing / Free Forever Block ──────────────────────────────────────── */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Simple Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              Free forever for startup founders
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Every early-stage founder deserves honest mathematical runway clarity.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-blue-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0E1524]/90 to-[#080C14]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                    Full Platform Access
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-extrabold font-mono text-white">₹0</span>
                    <span className="text-sm text-gray-400">/ forever free</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Everything you need to plan and extend your startup runway.
                  </p>
                </div>

                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-blue-900/30 active:scale-95 cursor-pointer self-start md:self-auto"
                >
                  Create Free Account
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-8 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full 36-month deterministic simulation engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited hiring timeline rows & role additions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Break-even calculation & cash zero markers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Side-by-side scenario comparison (Seed vs Aggressive)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Market sizing (TAM, SAM, SOM) with citations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8-Slide auto-filled investor pitch deck outline</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ Accordion ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-[#060910]/80 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-heading">
              Frequently asked questions
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-panel rounded-2xl px-6 py-2 border border-white/10">
              <FaqItem
                question="Is Burnly really free to use?"
                answer="Yes! The core financial simulator, 36-month projections, scenario comparison, and sensitivity analysis are 100% free with no credit card required. AI intelligence reports are powered by your own Gemini API integration on the backend."
              />
              <FaqItem
                question="How does Burnly calculate the runway and break-even point?"
                answer="Burnly uses a deterministic month-by-month financial projection loop. In each month, compounding revenue is balanced against fixed monthly expenses plus dynamic headcount additions according to your hiring start dates. Cash runway is marked the moment cash reserves reach zero."
              />
              <FaqItem
                question="Can I model different scenarios for my board or investors?"
                answer="Absolutely. You can create multiple scenarios (e.g. 'Base Model', 'Aggressive Scale-Up', 'Lean Bootstrapped') and compare cash runway, break-even month, and net burn side-by-side on the Compare page."
              />
              <FaqItem
                question="Is Burnly's output considered financial advice?"
                answer="No. Burnly is a mathematical planning aid and simulation tool. Projections reflect the exact logic of the assumptions and inputs provided. We always recommend reviewing your capital strategy with qualified accountants and financial advisors."
              />
              <FaqItem
                question="How is my startup's data protected?"
                answer="Your venture data is stored securely in your MongoDB database and protected by JWT authentication with isolated tenant IDs. For AI reports, non-sensitive financial metrics are processed via Google Gemini API — your personal credentials and passwords are never transmitted."
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <div className="glass-panel rounded-3xl p-10 sm:p-14 border border-blue-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                Get Total Financial Clarity
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 font-heading tracking-tight">
                Stop guessing your runway. Start simulating.
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mt-4 max-w-xl mx-auto">
                Join founders who use Burnly to plan hires, project runway, and make data-driven capital decisions.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-blue-900/30 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  Model Your Runway Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 bg-[#060910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight font-heading">Burnly</span>
              <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 ml-2">
                Fintech Engine
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#demo" className="hover:text-white transition-colors">Calculator</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Create Account</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>© {new Date().getFullYear()} Burnly. All rights reserved. Mathematical financial modeler for startups.</div>
            <div className="text-[11px] text-gray-500">
              Photos provided by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">Unsplash</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
