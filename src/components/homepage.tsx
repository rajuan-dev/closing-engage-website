import {
  CheckCircle2,
  FileText,
  Shield,
  ShieldCheck,
  Users,
  Zap,
  Video,
  UserCheck,
  Sparkles,
  Lock,
  FileSignature,
  Mic,
  Volume2,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── DATA ────────────────────────────────────────────────────────────────────

const capabilityItems = [
  "Efficient Notary Assignment",
  "Real-Time Order Tracking",
  "Secure Document Handling",
  "Centralized Workflow Management",
  "Built for High-Volume Closings",
];

const featureCards = [
  {
    icon: FileText,
    title: "Secure Document\nManagement",
    body: "Securely store and manage closing documents with encrypted access and controlled permissions",
  },
  {
    icon: Users,
    title: "Efficient Notary\nAssignment",
    body: "Connect title companies with qualified notaries while helping notaries receive consistent, relevant assignments",
  },
  {
    icon: Zap,
    title: "Real-Time Order\nTracking",
    body: "Provide full visibility for all parties with live updates throughout the closing process",
  },
  {
    icon: Shield,
    title: "High-Volume Document\nHandling",
    body: "Handle large closing packages efficiently for both title teams and signing professionals",
  },
];

const workflowSteps = [
  {
    number: "1",
    title: "Notary assignment",
    body: "Enter closing details and securely upload required documents.",
  },
  {
    number: "2",
    title: "Signing Completion",
    body: "The notary completes the signing in accordance with closing requirements",
  },
  {
    number: "3",
    title: "Scanback Review",
    body: "Documents are reviewed and approved prior to shipment to reduce errors and delays.",
  },
  {
    number: "4",
    title: "Secure Upload",
    body: "Signed documents are uploaded through the portal.",
  },
];

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "SSL Encryption",
    body: "256-bit bank-level encryption",
  },
  {
    icon: Shield,
    title: "Secure Cloud Storage",
    body: "SOC 2-compliant infrastructure for secure document storage",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    body: "Granular permissions to protect sensitive information",
  },
  {
    icon: Zap,
    title: "Activity Tracking",
    body: "Full visibility into every action for compliance and accountability",
  },
];

// ─── HERO SECTION ────────────────────────────────────────────────────────────

export function HomeHeroSection() {
  return (
    <section className="w-full">
      <div
        className="relative w-full flex items-center bg-[#07162E]"
        style={{
          backgroundImage:
            "linear-gradient(100deg, rgba(6,18,42,0.92) 0%, rgba(9,28,62,0.85) 30%, rgba(15,38,80,0.70) 55%, rgba(20,48,100,0.35) 75%, rgba(22,52,104,0.10) 100%), url('/branding/closing-engage-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 68px)",
        }}
      >
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-32 pb-20 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* LEFT: Text content */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Built for Title &amp; Escrow Teams
              </div>
              <h1 className="text-[52px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white md:text-[68px] lg:text-[76px]">
                A Modern Platform
                <br />
                for managing
                <br />
                Closing Orders
              </h1>
              <p className="mt-8 max-w-[580px] text-[18px] leading-[1.65] text-white">
                Streamline your entire closing process with a centralized
                platform designed to manage signing orders, coordinate with
                notaries, and maintain full visibility from start to finish.
              </p>
              <div className="mt-10">
                <Link
                  to="/signup/role-selection"
                  className="inline-flex h-[56px] items-center justify-center rounded-[12px] bg-white px-10 text-[15px] font-bold text-[#185abc] shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all hover:bg-white/95 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* RIGHT: Platform Capabilities card */}
            <div className="flex justify-end lg:pr-4">
              <div
                className="w-full max-w-[500px] rounded-[32px] px-12 py-11 shadow-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.42)",
                  backdropFilter: "blur(44px) saturate(190%)",
                  WebkitBackdropFilter: "blur(44px) saturate(190%)",
                  border: "1px solid rgba(255, 255, 255, 0.45)",
                  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.12)",
                }}
              >
                <p className="mb-8 text-[11px] font-extrabold uppercase tracking-[0.4em] text-[#185abc]">
                  Platform Capabilities
                </p>
                <ul className="space-y-5">
                  {capabilityItems.map((item) => (
                    <li key={item} className="flex items-center gap-6 text-[15.5px] font-semibold text-[#0f172a]">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#185abc]/15 text-[#185abc]">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURE SECTION (4 CARDS) ───────────────────────────────────────────────

export function HomeFeatureCards() {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        {/* Centered heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-[#0f172a] md:text-[34px]">
            Engineered for Reliability and Performance
          </h2>
          <p className="mt-4 text-[14px] leading-[1.75] text-[#64748b]">
            Our platform is designed to support the demands of modern closing
            workflows, delivering consistent performance, secure document
            handling, and dependable coordination.
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group flex flex-col rounded-2xl border border-[#e8edf5] bg-white p-6 shadow-[0_2px_12px_rgba(20,48,112,0.07)] transition-all hover:shadow-[0_8px_32px_rgba(20,48,112,0.12)] hover:-translate-y-0.5"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6ff] text-[#185abc] transition-colors group-hover:bg-[#dbeafe]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="whitespace-pre-line text-[15px] font-bold leading-snug text-[#0f172a]">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-[13px] leading-[1.7] text-[#64748b]">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── WORKFLOW SECTION ─────────────────────────────────────────────────────────

export function HomeWorkflowSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-24">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        {/* Left-aligned heading */}
        <div className="max-w-lg">
          <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-[#0f172a] md:text-[34px]">
            The closing workflow, Simplified
          </h2>
          <p className="mt-4 text-[14px] leading-[1.75] text-[#64748b]">
            A structured process designed to improve coordination, reduce
            delays, and provide full visibility from order placement to
            completion.
          </p>
        </div>

        {/* 4-step horizontal flow */}
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {workflowSteps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {idx < workflowSteps.length - 1 && (
                <div
                  className="absolute hidden md:block"
                  style={{
                    top: "20px",
                    left: "44px",
                    right: "-16px",
                    height: "1.5px",
                    background: "linear-gradient(90deg, #bfdbfe 0%, #dbeafe 100%)",
                  }}
                />
              )}
              {/* Circle */}
              <div className="relative z-10 mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#185abc] text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(24,90,188,0.35)]">
                {step.number}
              </div>
              <h3 className="text-[14px] font-bold text-[#0f172a]">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-[#64748b]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AUDIENCE SECTION ─────────────────────────────────────────────────────────

export function HomeAudienceSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT – For Title Companies (light blue tint) */}
          <div className="flex flex-col rounded-2xl border border-[#e8edf5] bg-[#f0f5ff] p-10">
            <h3 className="text-[24px] font-bold tracking-[-0.02em] text-[#0f172a]">
              For Title Companies
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Submit orders in under 60 seconds",
                "Live tracking of signing status",
                "Instant download of scanbacks",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-[#334155]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#185abc]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Link
                to="/signup?role=company&contactType=Title%20Company"
                className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-[#1d4ed8] px-8 py-3.5 text-[14px] font-bold !text-white shadow-[0_8px_20px_rgba(29,78,216,0.38)] transition-all hover:bg-[#1e40af] hover:shadow-[0_10px_24px_rgba(29,78,216,0.46)]"
              >
                Register Company
              </Link>
            </div>
          </div>

          {/* RIGHT – For Notaries (dark) */}
          <div className="flex flex-col rounded-2xl bg-[#1e293b] p-10">
            <h3 className="text-[24px] font-bold tracking-[-0.02em] text-white">
              For Notaries
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Receive premium local assignments",
                "Mobile-friendly task completion",
                "Simplified scanback uploading",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-[#94a3b8]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#60a5fa]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Link
                to="/signup?role=notary"
                className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-white px-8 py-3.5 text-[14px] font-bold text-[#1d4ed8] shadow-[0_8px_20px_rgba(15,23,42,0.26)] transition-all hover:bg-[#eff6ff] hover:shadow-[0_10px_24px_rgba(15,23,42,0.32)]"
              >
                Join Notary Pool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ─── SECURITY SECTION ────────────────────────────────────────────────────────

export function HomeSecuritySection() {
  return (
    <section className="w-full bg-[#f8fafc] py-24">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          {/* LEFT */}
          <div>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-[#0f172a] md:text-[34px]">
              Security is Our Foundation
            </h2>
            <p className="mt-5 text-[14px] leading-[1.75] text-[#64748b]">
              Closing Engage is built on enterprise-grade infrastructure to
              protect sensitive closing data, ensure compliance, and maintain
              secure document handling at every stage of the transaction.
            </p>

            <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {securityFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#185abc]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold leading-snug text-[#0f172a]">{feat.title}</h4>
                      <p className="mt-1 text-[12.5px] leading-[1.55] text-[#64748b]">{feat.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT – Enterprise Grade card */}
          <div className="flex h-full items-end justify-end lg:self-end">
            <div
              className="flex w-full items-center justify-center rounded-[18px] border border-[#dbe3f0] bg-[#eef2f8]"
              style={{
                minHeight: "230px",
              }}
            >
              <div className="flex flex-col items-center justify-center px-8 py-10 text-center">
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white text-[#6f95cf] shadow-[0_10px_30px_rgba(76,109,158,0.12)]">
                  <ShieldCheck className="h-9 w-9" />
                </div>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#b0b7c6]">
                  Enterprise Grade
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIAL SECTION ──────────────────────────────────────────────────────

export function HomeTestimonialSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl border border-[#e8edf5] bg-[#f4f7fc] px-10 py-12 shadow-[0_2px_16px_rgba(20,48,112,0.07)] md:px-16 md:py-16">
          {/* Stars */}
          <div className="flex gap-1 text-[18px] text-[#185abc]">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>★</span>
            ))}
          </div>

          {/* Large quote glyph */}
          <div
            className="absolute right-12 top-8 select-none text-[120px] leading-none font-serif text-[#185abc]/10"
            aria-hidden="true"
          >
            "
          </div>

          {/* Quote body */}
          <blockquote className="mt-7 max-w-3xl text-[20px] font-semibold leading-[1.65] tracking-[-0.01em] text-[#1e293b] md:text-[22px]">
            "Closing Engage has completely redefined how we manage our settlement
            workflows. The transparency and efficiency provided by the platform
            are unmatched in the industry."
          </blockquote>

          {/* Author */}
          <footer className="mt-9 flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-[#dbeafe]" />
            <div>
              <div className="text-[14px] font-bold text-[#0f172a]">Sarah J. Miller</div>
              <div className="text-[12.5px] text-[#64748b]">COO, Elite Title &amp; Escrow</div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}


// ─── CTA SECTION ─────────────────────────────────────────────────────────────

export function HomeCTASection() {
  return (
    <section
      className="w-full py-24"
      style={{
        backgroundImage: "url('/branding/cta-section-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 text-center lg:px-12">
        <h2 className="mx-auto max-w-lg text-[36px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white md:text-[44px]">
          Ready to streamline your closing workflow?
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup/role-selection"
            className="inline-flex items-center justify-center rounded-xl bg-white px-9 py-3.5 text-[14px] font-bold text-[#185abc] shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all hover:bg-[#f0f5ff] hover:shadow-[0_8px_30px_rgba(0,0,0,0.24)]"
          >
            Get Started
          </Link>
          <button className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-9 py-3.5 text-[14px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white/18 hover:border-white/50">
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export function HomeRONSection() {
  return (
    <section className="w-full bg-gradient-to-br from-white to-[#f1f5f9] text-[#0f172a] py-24 overflow-hidden relative border-t border-b border-[#e2e8f0]">
      {/* Decorative background glow lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#185abc]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left Column: Info & Details */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#185abc]/20 bg-[#185abc]/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#185abc] shadow-[0_4px_15px_rgba(24,90,188,0.06)]">
              <Sparkles size={12} className="animate-pulse" />
              Feature In Development
            </div>
            
            <div className="space-y-4">
              <h2 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f172a] md:text-[48px]">
                Remote Online <br className="hidden md:block" />
                Notarization (RON)
              </h2>
              <p className="text-[16px] leading-[1.75] text-[#475569] max-w-[580px]">
                Experience fully digital, legal closings from anywhere. Our upcoming Remote Online Notarization (RON) module will allow title companies and signers to execute secure, audio-video e-signings with certified online notaries in real-time.
              </p>
            </div>

            {/* Feature points */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] border border-[#dbeafe] text-[#185abc]">
                  <Video size={18} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0f172a]">Live Video Signing Room</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748b] font-medium">Secure, encrypted audio-video environment for notarizations.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] border border-[#dbeafe] text-[#185abc]">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0f172a]">KBA &amp; ID Verification</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748b] font-medium">Multi-factor Knowledge-Based Authentication and credential analysis.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] border border-[#dbeafe] text-[#185abc]">
                  <FileSignature size={18} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0f172a]">Cryptographic Seals</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748b] font-medium">Tamper-evident digital signatures conforming to MISMO standards.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] border border-[#dbeafe] text-[#185abc]">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#0f172a]">Compliance Vault</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748b] font-medium">Compliant session recordings stored securely for audit trails.</p>
                </div>
              </div>
            </div>

            {/* Waitlist Call-to-action */}
            <div className="pt-6 border-t border-[#e2e8f0] max-w-[500px]">
              <div className="text-[13px] font-semibold text-[#475569] mb-3">Be the first to know when we launch:</div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  className="h-11 flex-1 bg-white border border-[#cbd5e1] rounded-xl px-4 text-[13.5px] text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#185abc] focus:bg-[#f8fafc] transition shadow-inner"
                />
                <button className="h-11 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold px-5 text-[13.5px] shadow-[0_4px_12px_rgba(29,78,216,0.2)] transition active:scale-[0.98]">
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity UI Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[520px] rounded-[32px] border border-[#e2e8f0] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative overflow-hidden group">
              
              {/* Window Controls & Top Bar */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-6">
                  {/* Mac style window controls */}
                  <div className="flex gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] opacity-80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] opacity-80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] opacity-80" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-[#64748b]">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SESSION: CE-RON-842</span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-0.5 text-emerald-800 font-extrabold uppercase tracking-widest text-[9px]">
                  MISMO COMPLIANT
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid gap-3 grid-cols-2 mb-4">
                {/* Notary Video */}
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#e2e8f0] overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
                  {/* Top floating badge */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 rounded bg-[#185abc] text-white px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">
                      <Award size={10} className="text-amber-400" /> Commissioned Notary
                    </span>
                    <span className="text-[8px] font-bold text-white/50 bg-black/30 px-1.5 py-0.5 rounded font-mono">1080p</span>
                  </div>
                  
                  {/* Avatar graphic */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border-2 border-white/20 shadow-lg text-white font-bold relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#185abc]/20 to-[#60a5fa]/20" />
                    <span className="text-[20px] tracking-wide relative z-10">SA</span>
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-semibold text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg">
                    <span>Sarah A.</span>
                    <div className="flex items-center gap-1.5">
                      {/* Active Mic waveform graphic */}
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                        <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </span>
                      <Mic size={10} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Signer Video */}
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#334155] to-[#1e293b] border border-[#e2e8f0] overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
                  {/* Top floating badge */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 rounded bg-[#0284c7] text-white px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">
                      <UserCheck size={10} /> ID Verified
                    </span>
                    <span className="text-[8px] font-bold text-white/50 bg-black/30 px-1.5 py-0.5 rounded font-mono">TX, USA</span>
                  </div>
                  
                  {/* Avatar graphic */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border-2 border-white/20 shadow-lg text-white font-bold relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1d4ed8]/20 to-[#3b82f6]/20" />
                    <span className="text-[20px] tracking-wide relative z-10">JM</span>
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-semibold text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg">
                    <span>John M.</span>
                    <div className="flex items-center gap-1">
                      <Mic size={10} className="text-slate-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Controls Toolbar */}
              <div className="flex justify-center gap-2 mb-4">
                <div className="inline-flex items-center gap-1 bg-[#f1f5f9] border border-[#e2e8f0] rounded-full p-1.5 shadow-sm">
                  <button className="h-8 w-8 rounded-full bg-white border border-[#e2e8f0] text-slate-700 hover:bg-slate-50 transition flex items-center justify-center shadow-sm cursor-pointer">
                    <Mic size={14} />
                  </button>
                  <button className="h-8 w-8 rounded-full bg-[#185abc] text-white hover:bg-[#114695] transition flex items-center justify-center shadow-sm cursor-pointer">
                    <Video size={14} />
                  </button>
                  <button className="h-8 w-8 rounded-full bg-white border border-[#e2e8f0] text-slate-700 hover:bg-slate-50 transition flex items-center justify-center shadow-sm cursor-pointer">
                    <Volume2 size={14} />
                  </button>
                  <button className="h-8 w-8 rounded-full bg-white border border-[#e2e8f0] text-slate-700 hover:bg-slate-50 transition flex items-center justify-center shadow-sm cursor-pointer">
                    <Lock size={14} />
                  </button>
                </div>
              </div>

              {/* Document Status Widget & Mini Preview */}
              <div className="rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] p-4 flex gap-4 items-stretch relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                
                {/* Mini PDF Page Preview */}
                <div className="w-[90px] h-[112px] bg-white border border-[#cbd5e1] rounded-lg p-2 flex flex-col justify-between shadow-sm shrink-0 relative overflow-hidden group-hover:border-[#185abc] transition">
                  {/* Mock Text Lines */}
                  <div className="space-y-1.5">
                    <div className="h-1 bg-slate-300 rounded w-4/5" />
                    <div className="h-1 bg-slate-200 rounded w-full" />
                    <div className="h-1 bg-slate-200 rounded w-11/12" />
                    <div className="h-1 bg-slate-200 rounded w-5/6" />
                  </div>
                  
                  {/* Signature field mockup */}
                  <div className="border border-dashed border-[#185abc] bg-[#eff6ff] rounded px-1 py-0.5 text-[6px] text-center font-bold text-[#185abc] uppercase tracking-wider">
                    Sign Here
                  </div>
                  
                  {/* Mock Seal Stamp */}
                  <div className="absolute right-1.5 bottom-1.5 w-6 h-6 rounded-full border-2 border-emerald-600/30 flex items-center justify-center rotate-12 text-[4px] font-extrabold text-emerald-600/60 uppercase tracking-widest">
                    SEAL
                  </div>
                </div>

                {/* Right side Document details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h5 className="text-[13px] font-bold text-[#0f172a] truncate leading-tight">Closing_Disclosure_Package_Final.pdf</h5>
                    <p className="text-[11px] text-[#64748b] mt-0.5 font-medium">Page 4 of 128 • 16.2 MB</p>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 my-1.5 text-[9px] font-extrabold uppercase">
                    <span className="rounded bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 tracking-wider">
                      KBA: Passed
                    </span>
                    <span className="rounded bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 tracking-wider">
                      ID Verified
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#64748b]">
                      <span>Signing Progress</span>
                      <span className="text-[#0f172a]">75%</span>
                    </div>
                    <div className="w-full h-1 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#185abc] rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon overlay flag */}
              <div className="absolute inset-0 bg-[#0f172a]/10 backdrop-blur-[1px] flex items-center justify-center transition duration-300 group-hover:bg-[#0f172a]/5">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400/40 px-8 py-3 rounded-full text-slate-950 text-[14px] font-extrabold shadow-[0_10px_35px_rgba(245,158,11,0.35)] uppercase tracking-[0.25em] -rotate-3 hover:scale-105 transition duration-300 select-none animate-bounce" style={{ animationDuration: '3s' }}>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
