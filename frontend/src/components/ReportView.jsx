import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Globe,
  Users2,
  MapPin,
  Presentation,
  ShieldAlert,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Target,
  BarChart2,
  Zap,
  Info,
  Sliders,
  CheckSquare,
} from 'lucide-react';
import { ReportSkeleton } from './common/SkeletonLoader.jsx';

// Helper to compute sha256 inputs hash in browser
async function computeClientInputsHash(venture, scenarioData) {
  try {
    const payload = {
      venture: {
        name: venture?.name || '',
        oneLiner: venture?.oneLiner || '',
        industry: venture?.industry || '',
        stage: venture?.stage || '',
        team: venture?.team || [],
        financialSnapshot: venture?.financialSnapshot || {},
      },
      scenarioData: scenarioData || {},
    };
    const str = JSON.stringify(payload);
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.error('Error computing hash:', err);
  }
  return '';
}

export const ReportView = ({ type, activeScenario, activeVenture, token, onOpenAuth }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState(null);
  const [currentInputsHash, setCurrentInputsHash] = useState('');
  const [fetchingExisting, setFetchingExisting] = useState(false);

  // Report Type Titles & Configs
  const reportConfigs = {
    market: {
      title: 'Market Intelligence',
      subtitle: 'TAM, SAM, SOM sizing with assumptions & trend signals',
      icon: Globe,
      accentColor: 'text-blue-400',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-800/40',
    },
    competitors: {
      title: 'Competitor Mapping',
      subtitle: 'Comparison table, positioning matrix & gaps you can own',
      icon: Users2,
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-950/40',
      borderColor: 'border-indigo-800/40',
    },
    roadmap: {
      title: 'Execution Roadmap',
      subtitle: 'Runway-driven milestones & simulation hiring triggers',
      icon: MapPin,
      accentColor: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40',
      borderColor: 'border-cyan-800/40',
    },
    pitch: {
      title: 'Investor Pitch Outline',
      subtitle: '8-slide narrative outline auto-filled with financial figures',
      icon: Presentation,
      accentColor: 'text-violet-400',
      bgColor: 'bg-violet-950/40',
      borderColor: 'border-violet-800/40',
    },
    risk: {
      title: 'Risk Intelligence',
      subtitle: 'Financial score breakdown & Severity x Likelihood risk matrix',
      icon: ShieldAlert,
      accentColor: 'text-rose-400',
      bgColor: 'bg-rose-950/40',
      borderColor: 'border-rose-800/40',
    },
  };

  const config = reportConfigs[type] || reportConfigs.market;
  const HeaderIcon = config.icon;

  useEffect(() => {
    let isMounted = true;

    const checkAndFetch = async () => {
      const hash = await computeClientInputsHash(activeVenture, activeScenario?.data);
      if (isMounted) setCurrentInputsHash(hash);

      if (!token || !activeVenture?._id) {
        if (isMounted) setReport(null);
        return;
      }

      try {
        if (isMounted) setFetchingExisting(true);
        const res = await fetch(`/api/reports?ventureId=${activeVenture._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const reports = await res.json();
          const existing = reports.find((r) => r.type === type);
          if (isMounted) setReport(existing || null);
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        if (isMounted) setFetchingExisting(false);
      }
    };

    checkAndFetch();

    return () => {
      isMounted = false;
    };
  }, [type, activeVenture, activeScenario, token]);

  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const handleGenerate = async () => {
    if (!token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!activeVenture?._id) {
      setError('Please create or select a venture profile before generating intelligence reports.');
      return;
    }

    if (localStorage.getItem('burnly_ai_privacy_accepted') !== 'true') {
      setShowPrivacyNotice(true);
      return;
    }

    executeReportGeneration();
  };

  const executeReportGeneration = async () => {
    setLoading(true);
    setError(null);
    setLoadingStep(1);

    const step1Timer = setTimeout(() => setLoadingStep(2), 700);
    const step2Timer = setTimeout(() => setLoadingStep(3), 2000);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ventureId: activeVenture._id,
          scenarioId: activeScenario?._id || activeScenario?.id,
          type,
        }),
      });

      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate report');
      }

      const generatedReport = await res.json();
      setReport(generatedReport);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'An unexpected error occurred while generating the report.');
    } finally {
      setLoading(false);
    }
  };

  const renderProvenanceBadge = (provenance) => {
    if (provenance === 'Computed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-sm">
          <ShieldCheck className="w-3 h-3" /> Computed
        </span>
      );
    }
    if (provenance === 'Sourced') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60 shadow-sm">
          <Globe className="w-3 h-3" /> Sourced
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60 shadow-sm">
        <Sparkles className="w-3 h-3" /> Estimate
      </span>
    );
  };

  const renderDisclaimer = () => (
    <div className="mt-8 p-4 bg-[#151D2A] border border-[#222E42] rounded-xl text-center text-xs text-gray-400 font-medium leading-relaxed">
      ⚠️ <span className="font-semibold text-gray-300">Mandatory Disclaimer:</span> Burnly Intelligence reports are planning aids generated using AI reasoning and deterministic financial modeling. They do <span className="underline">NOT</span> constitute financial, legal, tax, or investment advice. Always verify metrics with qualified advisors before making capital decisions.
    </div>
  );

  const renderSources = (sources) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-6 p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" /> Grounding Sources & Citations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map((src, i) => (
            <div key={i} className="p-3 bg-[#0E1420] border border-[#222E42] rounded-lg text-xs space-y-1">
              <div className="font-semibold text-gray-200 flex items-center justify-between">
                <span>{src.title}</span>
                {(() => {
                  const safeUrl = src.url && typeof src.url === 'string' && (src.url.startsWith('http://') || src.url.startsWith('https://')) ? src.url : null;
                  return safeUrl ? (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 ml-2"
                    >
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null;
                })()}
              </div>
              {src.retrievalDate && (
                <div className="text-[11px] text-gray-500">Retrieved: {src.retrievalDate}</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-[11px] text-gray-500 italic pt-1 border-t border-[#222E42]/60">
          ℹ️ How sources work: Citations are populated from real Gemini Google Search retrieval metadata. Individual claims are tagged "Sourced" only when segment-level grounding links that specific claim to a retrieved source chunk; unlinked claims fall back to "Estimate".
        </div>
      </div>
    );
  };

  const isStale = report && currentInputsHash && report.inputsHash !== currentInputsHash;

  if (showPrivacyNotice) {
    return (
      <div className="p-8 bg-[#151D2A] border border-[#222E42] rounded-xl text-center space-y-5 max-w-lg mx-auto my-8 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100">Third-Party AI Data Processing Notice</h3>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            To generate intelligence reports, Burnly transmits your non-sensitive startup profile context (business idea, industry, stage, financial metrics) to Google Gemini API servers.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Your personal credentials, email, and password are <strong>never</strong> transmitted or shared.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setShowPrivacyNotice(false)}
            className="px-4 py-2 bg-[#0E1420] hover:bg-[#1A2436] text-gray-400 text-xs font-semibold rounded-lg border border-[#222E42]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              localStorage.setItem('burnly_ai_privacy_accepted', 'true');
              setShowPrivacyNotice(false);
              executeReportGeneration();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-colors"
          >
            I Understand & Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-6 text-center max-w-2xl mx-auto my-8">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <HeaderIcon className={`w-7 h-7 ${config.accentColor}`} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-100">Generating {config.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{config.subtitle}</p>
        </div>

        <div className="space-y-3 bg-[#0E1420] p-4 rounded-xl border border-[#222E42]">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
            <span>Step {loadingStep} of 3</span>
            <span className="text-blue-400 font-mono">{loadingStep === 1 ? '33%' : loadingStep === 2 ? '66%' : '90%'}</span>
          </div>
          <div className="w-full bg-[#151D2A] h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${loadingStep * 33}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-left space-y-1 mt-2">
            <div className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 1 ? 'text-emerald-400' : 'text-gray-600'}`} />
              1. Extracting financial snapshot & runway parameters...
            </div>
            <div className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? 'text-emerald-400' : 'text-gray-600'}`} />
              2. Querying Gemini API with search grounding...
            </div>
            <div className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? 'text-emerald-400' : 'text-gray-600'}`} />
              3. Computing provenance tags & validating sources...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchingExisting && !report) {
    return <ReportSkeleton />;
  }

  if (!report && !fetchingExisting) {
    return (
      <div className="p-8 bg-[#151D2A] border border-[#222E42] rounded-xl text-center space-y-5 max-w-2xl mx-auto my-8">
        <div className={`w-14 h-14 mx-auto rounded-2xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
          <HeaderIcon className={`w-7 h-7 ${config.accentColor}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-100">{config.title}</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">{config.subtitle}</p>
        </div>

        {!token ? (
          <div className="p-4 bg-[#0E1420] border border-[#222E42] rounded-xl text-xs space-y-3">
            <p className="text-gray-300">Sign in to generate tailored AI intelligence reports linked to your financial models.</p>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              Sign In to Generate Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#0E1420] border border-[#222E42] rounded-xl text-left text-xs text-gray-300 space-y-2">
              <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" /> Powered by Gemini LLM & Deterministic Math Engine
              </div>
              <p className="text-gray-400">
                Burnly anchors generative reasoning strictly to your verified startup profile and 36-month financial simulation metrics.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Generate {config.title}
            </button>
          </div>
        )}

        {renderDisclaimer()}
      </div>
    );
  }

  const content = report?.content || {};

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#151D2A] border border-[#222E42] rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
            <HeaderIcon className={`w-6 h-6 ${config.accentColor}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              {config.title}
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-medium">
                {activeVenture?.name || 'Venture'}
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Generated: {new Date(report?.generatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Model: {report?.model || 'gemini-1.5-flash'}
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-[#0E1420] hover:bg-[#1A2436] border border-[#222E42] text-gray-200 font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate Report
        </button>
      </div>

      {/* Stale Warning Banner */}
      {isStale && (
        <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Financial inputs or profile data changed!</span> This report was generated with previous parameters and may be out of date.
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Update Report
          </button>
        </div>
      )}

      {/* Executive Summary Card */}
      {content.summary && (
        <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-2">
          <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" /> Executive Summary
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* 1. MARKET INTELLIGENCE REPORT */}
      {type === 'market' && (
        <div className="space-y-6">
          {/* Visual TAM / SAM / SOM Cards with Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>TAM (Total Addressable)</span>
                {renderProvenanceBadge('Sourced')}
              </div>
              <div className="text-2xl font-extrabold text-blue-400">{content.tam?.value || 'N/A'}</div>
              <p className="text-xs text-gray-200 font-medium">{content.tam?.description}</p>
              {content.tam?.assumptions && (
                <div className="pt-2 border-t border-[#222E42] text-[11px] text-gray-400 space-y-1">
                  <span className="font-semibold text-gray-300">Stated Assumptions:</span>
                  <p>{content.tam.assumptions}</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>SAM (Serviceable Addressable)</span>
                {renderProvenanceBadge('Sourced')}
              </div>
              <div className="text-2xl font-extrabold text-indigo-400">{content.sam?.value || 'N/A'}</div>
              <p className="text-xs text-gray-200 font-medium">{content.sam?.description}</p>
              {content.sam?.assumptions && (
                <div className="pt-2 border-t border-[#222E42] text-[11px] text-gray-400 space-y-1">
                  <span className="font-semibold text-gray-300">Stated Assumptions:</span>
                  <p>{content.sam.assumptions}</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>SOM (3-Yr Obtainable Target)</span>
                {renderProvenanceBadge('Estimate')}
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">{content.som?.value || 'N/A'}</div>
              <p className="text-xs text-gray-200 font-medium">{content.som?.description}</p>
              {content.som?.assumptions && (
                <div className="pt-2 border-t border-[#222E42] text-[11px] text-gray-400 space-y-1">
                  <span className="font-semibold text-gray-300">Stated Assumptions:</span>
                  <p>{content.som.assumptions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Industry Trends */}
          {content.trends && content.trends.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Key Industry Trends & Market Drivers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.trends.map((item, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-200">{item.title}</h4>
                      {renderProvenanceBadge(item.provenance || 'Sourced')}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Opportunities */}
          {content.opportunities && content.opportunities.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Strategic Growth Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.opportunities.map((item, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-200">{item.title}</h4>
                      {renderProvenanceBadge(item.provenance || 'Estimate')}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. COMPETITOR MAPPING REPORT */}
      {type === 'competitors' && (
        <div className="space-y-6">
          {/* Direct Competitors Table */}
          {content.directCompetitors && content.directCompetitors.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Competitor Comparison Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.directCompetitors.map((comp, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-[#222E42] pb-2">
                      <span className="font-bold text-sm text-gray-100">{comp.name}</span>
                      {renderProvenanceBadge(comp.provenance || 'Sourced')}
                    </div>
                    <div className="text-xs space-y-1.5 text-gray-300">
                      <div><span className="text-gray-500 font-semibold">Positioning:</span> {comp.positioning}</div>
                      <div><span className="text-emerald-400 font-semibold">Strengths:</span> {comp.strengths}</div>
                      <div><span className="text-rose-400 font-semibold">Weaknesses:</span> {comp.weaknesses}</div>
                      {comp.pricing && <div><span className="text-blue-400 font-semibold">Pricing:</span> {comp.pricing}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps You Can Own */}
          {content.marketGaps && content.marketGaps.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" /> Market Gaps You Can Own
              </h3>
              <div className="space-y-3">
                {content.marketGaps.map((gap, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-200">Gap: {gap.gap}</div>
                      <div className="text-cyan-300 font-medium">Strategic Opportunity: {gap.opportunity}</div>
                    </div>
                    {renderProvenanceBadge('Estimate')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Axis Positioning Map */}
          {content.positioningMatrix && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                2-Axis Market Positioning Map
              </h3>
              <div className="p-5 bg-[#0E1420] border border-[#222E42] rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between text-gray-300 font-semibold border-b border-[#222E42] pb-2">
                  <span>X-Axis: {content.positioningMatrix.xAxisLabel}</span>
                  <span>Y-Axis: {content.positioningMatrix.yAxisLabel}</span>
                </div>
                <div className="p-3 bg-blue-950/60 border border-blue-800/80 rounded-lg text-blue-200 font-bold">
                  🎯 Target Venture Position: {content.positioningMatrix.venturePosition}
                </div>
                {content.positioningMatrix.competitors && content.positioningMatrix.competitors.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {content.positioningMatrix.competitors.map((c, idx) => (
                      <div key={idx} className="p-2.5 bg-[#151D2A] border border-[#222E42] rounded text-gray-300 flex items-center justify-between">
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-[11px] text-gray-400 font-mono">X: {c.x} | Y: {c.y}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EXECUTION ROADMAP REPORT */}
      {type === 'roadmap' && (
        <div className="space-y-6">
          {/* First 90 Days */}
          {content.first90Days && content.first90Days.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" /> First 90 Days Execution Priorities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.first90Days.map((item, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-100">
                      <span>Priority: {item.priority}</span>
                      {renderProvenanceBadge('Computed')}
                    </div>
                    <div className="text-gray-300">Target Metric: <span className="text-blue-400 font-semibold">{item.metric}</span></div>
                    {item.runwayCheck && <div className="text-gray-400 text-[11px]">Runway Check: {item.runwayCheck}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Phases & Runway Markers */}
          {content.phases && content.phases.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Runway-Driven Milestones & Simulation Hiring Triggers
              </h3>
              <div className="space-y-4">
                {content.phases.map((ph, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-[#222E42] pb-2">
                      <h4 className="font-bold text-sm text-cyan-400">{ph.phase}</h4>
                      <div className="flex items-center gap-2">
                        {ph.runwayMarker && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            📍 {ph.runwayMarker}
                          </span>
                        )}
                        {renderProvenanceBadge(ph.provenance || 'Computed')}
                      </div>
                    </div>

                    {ph.milestones && ph.milestones.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-400">Phase Milestones:</div>
                        <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                          {ph.milestones.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {ph.headcountTrigger && (
                      <div className="pt-2 text-xs text-indigo-300 font-medium border-t border-[#222E42]/60 flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5 text-indigo-400" /> Simulation Hiring Trigger: {ph.headcountTrigger}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. INVESTOR PITCH OUTLINE REPORT (Full 8 Slides) */}
      {type === 'pitch' && (
        <div className="space-y-6">
          {content.slides && content.slides.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                <Presentation className="w-4 h-4 text-violet-400" /> Full 8-Slide Investor Pitch Outline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.slides.map((slide, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-[#222E42] pb-2">
                        <span className="font-bold text-xs text-violet-400">Slide {slide.slideNumber || i + 1}: {slide.title}</span>
                        {renderProvenanceBadge(slide.provenance || 'Computed')}
                      </div>
                      <div className="text-sm font-semibold text-gray-200">{slide.headline}</div>
                      {slide.keyBulletPoints && (
                        <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                          {slide.keyBulletPoints.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. RISK INTELLIGENCE REPORT */}
      {type === 'risk' && (
        <div className="space-y-6">
          {/* Top Deterministic Financial Risk Score */}
          {content.financialRiskSummary && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                  Deterministic Financial Risk Score
                </h3>
                {renderProvenanceBadge('Computed')}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-extrabold text-rose-400">
                  {content.financialRiskSummary.score}/100
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-200">
                    Level: <span className="text-rose-400 uppercase">{content.financialRiskSummary.level} Risk</span>
                  </div>
                  <div className="text-xs text-gray-400">{content.financialRiskSummary.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Visual Severity x Likelihood Risk Matrix */}
          <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" /> Qualitative Risk Matrix (Severity × Likelihood)
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-lg space-y-1">
                <div className="font-bold text-rose-300 text-[11px]">High Severity / High Likelihood</div>
                <div className="text-gray-300 text-[11px]">Critical Focus Area</div>
              </div>
              <div className="p-3 bg-amber-950/80 border border-amber-800/80 rounded-lg space-y-1">
                <div className="font-bold text-amber-300 text-[11px]">High Severity / Med Likelihood</div>
                <div className="text-gray-300 text-[11px]">Active Mitigation Plan</div>
              </div>
              <div className="p-3 bg-blue-950/80 border border-blue-800/80 rounded-lg space-y-1">
                <div className="font-bold text-blue-300 text-[11px]">High Severity / Low Likelihood</div>
                <div className="text-gray-300 text-[11px]">Contingency Reserve</div>
              </div>
            </div>
          </div>

          {/* Qualitative Risks Matrix List */}
          {content.qualitativeRisks && content.qualitativeRisks.length > 0 && (
            <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Qualitative Risk Factors & Mitigation Actions
              </h3>
              <div className="space-y-3">
                {content.qualitativeRisks.map((risk, i) => (
                  <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-[#222E42] pb-2">
                      <span className="font-bold text-gray-200">{risk.category}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.severity === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          risk.severity === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          Severity: {risk.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#151D2A] text-gray-300 border border-[#222E42]">
                          Likelihood: {risk.likelihood || 'Med'}
                        </span>
                        {renderProvenanceBadge(risk.provenance || 'Estimate')}
                      </div>
                    </div>
                    <div className="text-gray-300 font-medium">Risk Factor: {risk.risk}</div>
                    <div className="text-gray-400">Suggested Mitigation: <span className="text-emerald-400 font-semibold">{risk.mitigation}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sources Section */}
      {renderSources(report?.sources || content.sources)}

      {/* Mandatory Footer Disclaimer */}
      {renderDisclaimer()}
    </div>
  );
};
