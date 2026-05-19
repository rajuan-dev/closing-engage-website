import React, { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlignLeft,
  BarChart3,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  Info,
  Key,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Network,
  Phone,
  Shield,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "@/store/useToastStore";
import {
  HomeAudienceSection,
  HomeCTASection,
  HomeFeatureCards,
  HomeHeroSection,
  HomeSecuritySection,
  HomeTestimonialSection,
  HomeWorkflowSection,
} from "@/components/homepage";
import {
  AuthShell,
  ForgotPasswordForm,
  LoginForm,
  OtpVerificationForm,
  RoleCard,
  SignupFlowForm,
  ServicesGrid,
} from "@/components/marketing";
import { Button, Input, Surface, Textarea } from "@/components/common";

export function HomePage() {
  return (
    <div>
      <HomeHeroSection />
      <HomeFeatureCards />
      <HomeWorkflowSection />
      <HomeAudienceSection />
      <HomeSecuritySection />
      <HomeTestimonialSection />
      <HomeCTASection />
    </div>
  );
}

export function ServicesPage() {
  return (
    <>
      <section className="overflow-hidden bg-white pt-0">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 100% 36%, rgba(220,232,249,0.95) 0%, rgba(236,243,252,0.86) 20%, rgba(247,250,255,0.46) 38%, rgba(255,255,255,0) 58%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10">
            <div className="mx-auto max-w-[1440px] py-18 md:py-22">
              <div className="max-w-[680px]">
              <h1 className="text-[52px] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink-900 md:text-[68px]">
                Our Services
              </h1>
              <p className="mt-6 text-[18px] leading-[1.8] text-ink-600">
                Closing Engage provides professional-grade tools to manage closing orders
                and document workflows securely, connecting title companies and notaries in
                one unified environment.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f7fd] py-16 md:py-18">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <ServicesGrid />
        </div>
      </section>
      <section className="py-20 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="max-w-[620px]">
              <h2 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink-900 md:text-[42px]">
                Built for Performance
              </h2>
              <div className="mt-9 space-y-6">
                {[
                  ["Large File Upload Support", "Handle 150+ page PDFs with ease, optimized for high-volume document environments."],
                  ["Secure Cloud Document Storage", "Redundant, encrypted storage that meets rigorous legal and financial security standards."],
                  ["Role-Based Access Control", "Granular permissions for teams, ensuring individuals only see the data they need."],
                  ["Audit Logs for Transparency", "Complete history of every action taken on an order, providing a bulletproof audit trail."],
                ].map(([title, body]) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf4ff] text-brand-600">
                      <div className="h-3 w-3 rounded-full bg-brand-600" />
                    </div>
                    <div>
                      <div className="text-[18px] font-bold text-ink-900">{title}</div>
                      <p className="mt-1.5 text-[14px] leading-[1.8] text-ink-500">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative max-w-[620px] pb-14 pl-10">
              <div className="rounded-[34px] bg-white p-4 shadow-[0_12px_30px_rgba(20,48,112,0.05)] md:p-5">
                <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#e7f3ee,#ccdfd7)]">
                  <img
                    src="/branding/services-performance-dashboard.png"
                    alt="Secure financial dashboard interface"
                    className="block h-auto w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 rounded-[22px] bg-brand-600 px-8 py-6 text-white shadow-[0_22px_40px_rgba(24,90,188,0.26)]">
                <div className="text-[26px] font-extrabold leading-none">99.9%</div>
                <div className="mt-2 max-w-[210px] text-[12px] leading-[1.55] text-white/82">
                  Uptime reliability for critical closing operations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-24 md:pb-28">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
            <div className="max-w-[500px] rounded-[24px] bg-[#eef0fb] p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)] md:p-6">
              <div className="flex items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#0f5053,#83c3cb)] p-0">
                <img
                  src="/branding/services-efficiency-workflow.png"
                  alt="Workflow efficiency diagram"
                  className="block h-auto w-full rounded-[18px] object-cover"
                />
              </div>
            </div>
            <div className="max-w-[680px]">
              <h2 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink-900 md:text-[42px]">
                Engineered for Efficiency
              </h2>
              <p className="mt-6 text-[16px] leading-[1.9] text-ink-500">
                Closing Engage eliminates the friction inherent in traditional real estate transactions. By centralizing communication, we remove the need for manual emails and constant phone tag.
              </p>
              <p className="mt-6 text-[16px] leading-[1.9] text-ink-500">
                Our platform replaces disparate spreadsheets with a single source of truth, creating a direct and secure line between title agents and notaries. This architectural approach ensures data integrity while accelerating closing times by up to 40%.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div
            className="relative overflow-hidden rounded-[34px] px-8 py-12 text-center text-white shadow-[0_20px_50px_rgba(24,90,188,0.18)] md:px-12 md:py-14"
            style={{
              backgroundImage: "url('/branding/services-cta-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h2 className="mx-auto max-w-[980px] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white md:text-[40px]">
              Start Managing Closing Orders with Confidence
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                className="min-w-[140px] rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-brand-600 hover:bg-[#f4f7ff]"
                onClick={() => window.location.assign("/signup/role-selection")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="min-w-[140px] rounded-xl border-white/30 bg-white/8 px-8 py-3.5 text-[15px] font-bold text-white hover:bg-white/14"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="relative min-h-[340px] bg-cover bg-center bg-no-repeat md:min-h-[420px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(13,20,36,0.62) 0%, rgba(13,20,36,0.48) 28%, rgba(13,20,36,0.18) 100%), url('/branding/about-hero.png')",
          }}
        >
          <div className="mx-auto flex min-h-[340px] w-full max-w-[1440px] items-center px-6 lg:px-10 md:min-h-[420px]">
            <div className="max-w-[700px] text-white">
              <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.045em] md:text-[64px]">
                About Closing Engage
              </h1>
              <p className="mt-5 max-w-[560px] text-[18px] leading-[1.8] text-white/82">
                Learn more about our mission to simplify closing order workflows
                between title companies and notaries.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f7fd] py-20 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-[620px]">
              <div className="inline-flex rounded-full bg-[#edf4ff] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-600">
                Our Journey
              </div>
              <h2 className="mt-5 text-[38px] font-extrabold leading-[1.08] tracking-[-0.04em] text-ink-900">
                Our Story
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-[1.85] text-ink-500">
                <p>Closing Engage was created to address the inefficiencies in managing closing orders between title companies and notaries.</p>
                <p>Many closing workflows still rely on fragmented communication, manual coordination, and limited visibility into order status. These gaps often lead to delays, errors, and unnecessary back-and-forth.</p>
                <p>Closing Engage was built to bring structure to this process, providing a centralized system to manage assignments, track progress, and handle documents with consistency and control.</p>
                <p>Today, the platform supports a more organized and reliable closing experience by reducing friction and improving coordination across every transaction.</p>
              </div>
            </div>
            <div className="max-w-[560px] justify-self-end rounded-[24px] bg-white p-4 shadow-[0_16px_38px_rgba(20,48,112,0.08)]">
              <img
                src="/branding/about-story-meeting.png"
                alt="Closing Engage team meeting"
                className="block w-full rounded-[20px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink-900">
              Our Team
            </h2>
            <div className="mx-auto mt-3 h-[3px] w-16 rounded-full bg-brand-600" />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Dyarramo", "Founder & CEO", "Former real estate attorney passionate about digital transformation in the legal industry.", "/branding/team-dyarramo.png"],
              ["Sarah Miller", "COO", "Operations expert with 15 years experience scaling fintech platforms across North America.", "/branding/team-sarah-miller.png"],
              ["Marcus Thorne", "CTO", "Cybersecurity specialist focused on building unbreakable document workflow environments.", "/branding/team-marcus-thorne.png"],
              ["Elena Rodriguez", "Head of Product", "Driving user-centric design that simplifies complex legal compliance tasks.", "/branding/team-elena-rodriguez.png"],
            ].map(([name, role, body, imageSrc]) => (
              <Surface
                key={name}
                className="rounded-[22px] border border-[#dbe3f0] bg-white p-5 shadow-[0_10px_28px_rgba(20,48,112,0.05)]"
              >
                <div className="mb-5 overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#d9dde7,#f3f5fa)]">
                  <img
                    src={imageSrc}
                    alt={name}
                    className="block h-[270px] w-full object-cover"
                  />
                </div>
                <div className="text-[20px] font-extrabold tracking-[-0.025em] text-ink-900">{name}</div>
                <div className="mt-1 text-[14px] font-semibold text-brand-600">{role}</div>
                <p className="mt-5 text-[14px] leading-[1.75] text-ink-500">{body}</p>
              </Surface>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full overflow-hidden pb-24">
        <div className="relative">
          <img
            src="/branding/about-cta-fullwidth.png"
            alt="About page call to action background"
            className="block h-auto w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center text-white">
              <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-[-0.04em] md:text-[56px]">
                Join Closing Engage Today
              </h2>
              <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-[1.8] text-white/80">
                Experience the future of closing order management. Secure, professional,
                and built for modern teams.
              </p>
              <div className="mt-8 flex justify-center">
                <Button
                  className="min-w-[150px] rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-brand-600 hover:bg-[#f4f7ff]"
                  onClick={() => window.location.assign("/signup/role-selection")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <section className="overflow-hidden bg-white pt-0">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 100% 36%, rgba(220,232,249,0.95) 0%, rgba(236,243,252,0.86) 20%, rgba(247,250,255,0.46) 38%, rgba(255,255,255,0) 58%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10">
            <div className="mx-auto max-w-[1440px] py-18 md:py-22">
              <div className="max-w-[680px]">
                <h1 className="text-[52px] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink-900 md:text-[68px]">
                  Contact Us
                </h1>
                <p className="mt-6 text-[18px] leading-[1.8] text-ink-600">
                  Have questions about Closing Engage or need help getting started?
                  Reach out and our team will assist you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f7fd] py-16 md:py-18">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Surface className="rounded-[20px] border border-[#dbe3f0] bg-white p-8 shadow-[0_8px_24px_rgba(20,48,112,0.05)]">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full Name" placeholder="John Doe" />
                <Input label="Email" placeholder="john@company.com" />
                <Input label="Company" placeholder="Acme Corp" />
                <Input label="Subject" placeholder="General Inquiry" />
              </div>
              <div className="mt-5">
                <Textarea label="Message" placeholder="How can we help you?" />
              </div>
              <Button className="mt-6 rounded-lg px-7">Send Message</Button>
            </Surface>
            <div className="px-2 pt-1 lg:px-6">
              <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink-900">
                Contact Information
              </h2>
              <div className="mt-8 space-y-7">
                {[
                  { icon: Mail, title: "Email", body: "hello@closingengage.com" },
                  { icon: Phone, title: "Phone", body: "+1 (555) 123-4567" },
                  { icon: MapPin, title: "Address", body: "101 Financial District, Suite 500\nNew York, NY 10005" },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-brand-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-ink-900">{title}</div>
                      <div className="mt-1 whitespace-pre-line text-[14px] leading-[1.7] text-ink-500">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full overflow-hidden pb-24">
        <div className="relative">
          <img
            src="/branding/about-cta-fullwidth.png"
            alt="Contact page call to action background"
            className="block h-auto w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center text-white">
              <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-[-0.04em] md:text-[56px]">
                Ready to Simplify Your Closing Workflow?
              </h2>
              <div className="mt-8 flex justify-center">
                <Button
                  className="min-w-[150px] rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-brand-600 hover:bg-[#f4f7ff]"
                  onClick={() => window.location.assign("/signup/role-selection")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function PrivacyPolicyPage() {
  return (
    <>
      <section className="overflow-hidden bg-white pt-0">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 100% 36%, rgba(220,232,249,0.95) 0%, rgba(236,243,252,0.86) 20%, rgba(247,250,255,0.46) 38%, rgba(255,255,255,0) 58%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10">
            <div className="mx-auto max-w-[1440px] py-16 md:py-20">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="max-w-[620px]">
                  <h1 className="text-[48px] font-extrabold leading-[1.06] tracking-[-0.045em] text-ink-900 md:text-[62px]">
                    Privacy Policy
                  </h1>
                  <p className="mt-5 text-[17px] leading-[1.8] text-ink-600">
                    Learn how Closing Engage collects, uses, and protects your
                    information. Our architecture is built on the foundation of
                    trust and technical transparency.
                  </p>
                </div>
                <div className="justify-self-end rounded-[30px] border border-[#d8e1f0] bg-[linear-gradient(135deg,#dfe8ff,#edf3ff)] px-10 py-9 shadow-[0_12px_32px_rgba(20,48,112,0.06)]">
                  <div className="flex min-w-[260px] flex-col items-center justify-center text-center">
                    <div className="flex h-22 w-22 items-center justify-center rounded-[24px] bg-white text-brand-600 shadow-[0_16px_38px_rgba(20,48,112,0.08)]">
                      <Shield className="h-10 w-10" />
                    </div>
                    <div className="mt-7 w-full rounded-[18px] bg-white/92 px-6 py-5">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-600">
                        Security Protocol 402.b
                      </div>
                      <div className="mt-2 text-[13px] leading-[1.6] text-ink-500">
                        Active Encryption Layers: AES-256
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f7fd] py-16 md:py-18">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="mb-10 border-t border-[#dbe3f0] pt-8">
            <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-600">
              Introduction
            </div>
            <p className="max-w-[980px] text-[14px] leading-[1.9] text-ink-500">
              At Closing Engage, your privacy is not an afterthought; it is our
              primary engineering requirement. We are committed to maintaining the
              highest standards of data integrity and protection, ensuring that your
              sensitive legal and financial information remains confidential and
              secure throughout the closing process.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                icon: UserRound,
                title: "Personal Information",
                body: "Name, contact details, and identifiers required for legal verification.",
              },
              {
                icon: Lock,
                title: "Account Info",
                body: "Login credentials and profile settings necessary for your secure workspace.",
              },
              {
                icon: FileText,
                title: "Documents",
                body: "Financial records and legal contracts processed through our secure vault.",
              },
              {
                icon: BarChart3,
                title: "Usage Data",
                body: "Technical metadata to improve performance and ensure platform security.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <Surface
                key={title}
                className="rounded-[18px] border border-[#dbe3f0] bg-white p-6 shadow-[0_8px_24px_rgba(20,48,112,0.05)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-[18px] font-extrabold tracking-[-0.02em] text-ink-900">
                  {title}
                </div>
                <div className="mt-2 text-[14px] leading-[1.75] text-ink-500">
                  {body}
                </div>
              </Surface>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-18 md:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink-900">
                How We Use Information
              </h2>
              <div className="mt-8 space-y-5">
                {[
                  ["01", "Account Management", "Facilitating access to your closing dashboard and secure files."],
                  ["02", "Processing Orders", "Executing transactions and legal filings on your behalf."],
                  ["03", "Communication", "Sending critical updates, security alerts, and support responses."],
                ].map(([number, title, body]) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[12px] font-extrabold text-brand-600">
                      {number}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-ink-900">{title}</div>
                      <div className="mt-1 text-[14px] leading-[1.75] text-ink-500">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[22px] bg-brand-600 p-8 text-white shadow-[0_18px_38px_rgba(24,90,188,0.18)]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-[28px] font-extrabold tracking-[-0.03em]">
                    Data Security Architecture
                  </div>
                  <p className="mt-4 max-w-[460px] text-[14px] leading-[1.8] text-white/82">
                    We employ bank-grade security protocols to ensure your data is
                    never compromised.
                  </p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <Lock className="h-9 w-9" />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Cloud Storage", "SSL Encryption", "Role-based Access"].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Data Sharing", "We share information only with trusted third-party partners necessary for operations (e.g., payment processors, legal filing systems) or when legally mandated by government authorities."],
              ["User Rights", "Access your personal data records\nRequest correction of inaccuracies\nRequest deletion of non-legal records"],
              ["Periodic Updates", "Our privacy policy is reviewed quarterly. Users will be notified via email regarding any significant material changes."],
              ["Contact Privacy Team", "privacy@closingengage.com\nResponse time: within 24 business hours."],
            ].map(([title, body]) => (
              <Surface
                key={title}
                className="rounded-[18px] border border-[#dbe3f0] bg-white p-6 shadow-[0_8px_24px_rgba(20,48,112,0.05)]"
              >
                <div className="text-[18px] font-extrabold tracking-[-0.02em] text-ink-900">{title}</div>
                <div className="mt-3 whitespace-pre-line text-[14px] leading-[1.8] text-ink-500">{body}</div>
              </Surface>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function LoginPage() {
  return (
    <AuthShell title="Welcome Back!" subtitle="To login, enter your Username">
      <LoginForm />
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot Password?"
      subtitle="Enter your email and we will send you a verification code."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

export function OtpVerificationPage() {
  return (
    <AuthShell
      title="Verify Your Email"
      subtitle="Use the one-time verification code sent to your email address."
    >
      <OtpVerificationForm />
    </AuthShell>
  );
}

export function RoleSelectionPage() {
  const [expandedCard, setExpandedCard] = useState<"company" | "notary" | null>(null);
  const navigate = useNavigate();

  const companyOptions = [
    { name: "Title Company", icon: Building2 },
    { name: "Escrow Company", icon: Briefcase },
    { name: "Real Estate Agency", icon: Home },
    { name: "Mortgage Lender", icon: Key },
    { name: "Law Firm / Attorney Office", icon: Shield },
    { name: "Financial Institution / Bank", icon: Landmark },
    { name: "Business / Corporate Client", icon: Network },
    { name: "Individual Client", icon: UserRound },
    { name: "Other", icon: HelpCircle },
  ];

  return (
    <AuthShell title="Choose Your Role" subtitle="Start by selecting the workspace that best matches how you use Closing Engage.">
      <div className="mx-auto max-w-[720px] space-y-4">
        
        {/* Company Card Accordion */}
        <div
          className={`rounded-[24px] bg-[linear-gradient(135deg,#2f6ad6,#4c8ef7)] text-white shadow-[0_15px_35px_rgba(20,48,112,0.08)] transition-all duration-300 overflow-hidden border border-white/10 ${
            expandedCard === "company" ? "scale-[1.005] ring-2 ring-brand-200" : "hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(20,48,112,0.12)]"
          }`}
        >
          {/* Card Header (Toggle Button) */}
          <div
            onClick={() => setExpandedCard(expandedCard === "company" ? null : "company")}
            className="flex items-center justify-between gap-5 px-6 py-5 cursor-pointer select-none"
          >
            <div className="text-left">
              <div className="text-[20px] md:text-[22px] font-extrabold leading-none tracking-[-0.03em] text-white">I Require Signing Services</div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70">Title Companies & Businesses</div>
              <p className="mt-2.5 max-w-[480px] text-[13.5px] leading-relaxed text-white/85 font-medium">
                Create a company workspace to place orders, manage teams, coordinate closings, and track document workflows end to end.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/10 transition-all duration-300 hover:bg-white/20">
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedCard === "company" ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Smooth Grid Accordion container */}
          <div
            className={`grid transition-all duration-350 ease-in-out border-white/10 ${
              expandedCard === "company" ? "grid-rows-[1fr] opacity-100 border-t bg-black/10" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 py-5">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/80 mb-3.5 text-left">
                  Please select your organization type:
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {companyOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => navigate(`/signup?role=company&contactType=${encodeURIComponent(opt.name)}`)}
                        className="w-full h-11 bg-white/10 hover:bg-white text-white hover:text-brand-700 font-extrabold rounded-xl px-4 text-[13.5px] transition-all flex items-center justify-between group active:scale-[0.98] border border-white/20 hover:border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="h-4 w-4 shrink-0 text-white/90 group-hover:text-brand-600 transition-colors" />
                          <span>{opt.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notary Card Accordion */}
        <div
          className={`rounded-[24px] bg-[linear-gradient(135deg,#2f6ad6,#4c8ef7)] text-white shadow-[0_15px_35px_rgba(20,48,112,0.08)] transition-all duration-300 overflow-hidden border border-white/10 ${
            expandedCard === "notary" ? "scale-[1.005] ring-2 ring-brand-200" : "hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(20,48,112,0.12)]"
          }`}
        >
          {/* Card Header (Toggle Button) */}
          <div
            onClick={() => setExpandedCard(expandedCard === "notary" ? null : "notary")}
            className="flex items-center justify-between gap-5 px-6 py-5 cursor-pointer select-none"
          >
            <div className="text-left">
              <div className="text-[20px] md:text-[22px] font-extrabold leading-none tracking-[-0.03em] text-white">I Am A Notary Signing Agent</div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70">Notaries & Independent Signing Agents</div>
              <p className="mt-2.5 max-w-[480px] text-[13.5px] leading-relaxed text-white/85 font-medium">
                Create a notary workspace to receive assignments, manage credentials, upload documents, and stay current on every order.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/10 transition-all duration-300 hover:bg-white/20">
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expandedCard === "notary" ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Smooth Grid Accordion container */}
          <div
            className={`grid transition-all duration-350 ease-in-out border-white/10 ${
              expandedCard === "notary" ? "grid-rows-[1fr] opacity-100 border-t bg-black/10" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 py-5 flex flex-col items-center">
                <p className="text-[13.5px] font-semibold text-white/90 mb-4 text-center max-w-[440px] leading-relaxed">
                  Ready to setup your independent notary workspace and access local signing orders?
                </p>
                <button
                  onClick={() => navigate("/signup?role=notary")}
                  className="px-6 h-11 bg-white hover:bg-slate-50 text-brand-600 font-extrabold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-white"
                >
                  <span>Continue to Notary Registration</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AuthShell>
  );
}

// --- Custom Helper Components for Request Access Page ---
function CustomInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label className="block text-[12.5px] font-extrabold text-[#475569] mb-1.5">{label}</label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 bg-[#f8fbff] border border-[#e2e8f0] rounded-2xl text-[14.5px] text-slate-900 placeholder-slate-455 outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all font-medium ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label className="block text-[12.5px] font-extrabold text-[#475569] mb-1.5">{label}</label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 bg-[#f8fbff] border border-[#e2e8f0] rounded-2xl text-[14.5px] text-slate-900 outline-none appearance-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all font-extrabold cursor-pointer pr-10 ${
            icon ? "pl-11" : "px-4"
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="font-bold text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function CustomTextarea({
  label,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col flex-grow">
      <label className="block text-[12.5px] font-extrabold text-[#475569] mb-1.5">{label}</label>
      <div className="relative flex items-start flex-grow">
        {icon && (
          <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
          </div>
        )}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[110px] min-h-[110px] bg-[#f8fbff] border border-[#e2e8f0] rounded-2xl text-[14.5px] text-slate-900 placeholder-slate-455 outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all resize-none font-medium py-3 ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const navigate = useNavigate();

  // Custom states for Request Access page (role=company)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactType, setContactType] = useState(searchParams.get("contactType") || "Title Company");
  const [requestType, setRequestType] = useState("Access Request");
  const [coverageArea, setCoverageArea] = useState("");
  const [message, setMessage] = useState("");

  // Custom states for Notary Application page (role=notary)
  const [notaryFullName, setNotaryFullName] = useState("");
  const [notaryEmail, setNotaryEmail] = useState("");
  const [notaryPhone, setNotaryPhone] = useState("");
  const [commissionNumber, setCommissionNumber] = useState("");
  const [commissionExpiration, setCommissionExpiration] = useState("");
  const [eoInsurance, setEoInsurance] = useState("$100,000");
  const [certifications, setCertifications] = useState("NNA Certified Signing Agent");
  const [notaryCoverageArea, setNotaryCoverageArea] = useState("");
  const [notaryMessage, setNotaryMessage] = useState("");

  if (role !== "company" && role !== "notary") {
    return <Navigate to="/signup/role-selection" replace />;
  }

  if (role === "company") {
    const handleRequestAccess = (e: React.FormEvent) => {
      e.preventDefault();
      if (!fullName || !email) {
        toast.error("Please fill in all required fields (Full Name and Email).");
        return;
      }

      // Capture request in localStorage for Admin Dashboard live integration
      try {
        const existingReqs = JSON.parse(localStorage.getItem("registration_requests") || "[]");
        const newReq = {
          id: `REQ-${Date.now()}`,
          role: "company",
          fullName,
          email,
          phone: phone || "N/A",
          companyName: companyName || "Independent Escrow LLC",
          contactType: contactType || "Title Company",
          requestType: requestType || "Access Request",
          coverageArea: coverageArea || "N/A",
          status: "Pending",
          createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          message: message || "No additional comments."
        };
        localStorage.setItem("registration_requests", JSON.stringify([newReq, ...existingReqs]));
      } catch (err) {
        console.error("Failed to write request to localStorage:", err);
      }

      toast.success("Access request submitted successfully! A representative will reach out shortly.");
      navigate("/company/dashboard");
    };

    return (
      <div className="min-h-screen bg-[#f8fafc] py-4 md:py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center font-sans overflow-hidden">
        <div className="w-full max-w-[1140px] flex flex-col items-center flex-grow justify-center my-auto">
          {/* Logo & Header */}
          <div className="flex justify-center mb-3">
            <img
              src="/branding/closing-engage-logo.svg"
              alt="Closing Engage"
              className="h-8 w-auto object-contain"
            />
          </div>
          
          <h1 className="text-center text-[26px] md:text-[30px] font-extrabold tracking-tight text-slate-900 leading-none">
            Request Access
          </h1>
          <p className="mt-2 text-center text-[14px] leading-normal text-slate-500 max-w-[540px] mx-auto font-medium">
            Complete the secure request below to register your company and set up your Closing Engage workspace.
          </p>

          {/* Compact Form Card with 2-Column Split Layout */}
          <form
            onSubmit={handleRequestAccess}
            className="mt-4 w-full bg-white rounded-[24px] border border-slate-200/60 shadow-[0_20px_50px_rgba(20,48,112,0.03)] p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Column: Form Inputs */}
              <div className="space-y-3.5 flex flex-col justify-between">
                <div className="flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                  <UserRound className="h-5 w-5 text-brand-600 shrink-0" />
                  <div>
                    <h2 className="text-[16px] font-black text-slate-900 leading-none">Registration Details</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Please fill out all identity credentials</p>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <CustomInput
                    label="Full Name*"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={setFullName}
                    icon={<UserRound />}
                  />
                  <CustomInput
                    label="Email Address*"
                    placeholder="john@company.com"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail />}
                  />
                  <CustomInput
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    icon={<Phone />}
                  />
                  <CustomInput
                    label="Company Name"
                    placeholder="Acme Corporation"
                    value={companyName}
                    onChange={setCompanyName}
                    icon={<Building2 />}
                  />
                  <CustomSelect
                    label="Contact Type"
                    options={[
                      { label: "Title Company", value: "Title Company" },
                      { label: "Escrow Company", value: "Escrow Company" },
                      { label: "Real Estate Agency", value: "Real Estate Agency" },
                      { label: "Mortgage Lender", value: "Mortgage Lender" },
                      { label: "Law Firm / Attorney Office", value: "Law Firm / Attorney Office" },
                      { label: "Financial Institution / Bank", value: "Financial Institution / Bank" },
                      { label: "Business / Corporate Client", value: "Business / Corporate Client" },
                      { label: "Individual Client", value: "Individual Client" },
                      { label: "Other", value: "Other" },
                    ]}
                    value={contactType}
                    onChange={setContactType}
                    icon={<Briefcase />}
                  />
                  <CustomSelect
                    label="Request Type"
                    options={[
                      { label: "Access Request", value: "Access Request" },
                      { label: "Support Inquiry", value: "Support Inquiry" },
                      { label: "General Questions", value: "General Questions" },
                    ]}
                    value={requestType}
                    onChange={setRequestType}
                    icon={<Shield />}
                  />
                </div>
                
                <div className="pt-0.5">
                  <CustomInput
                    label="State / Coverage Area"
                    placeholder="e.g. California (CA)"
                    value={coverageArea}
                    onChange={setCoverageArea}
                    icon={<MapPin />}
                  />
                </div>
              </div>

              {/* Right Column: Textarea, Warning banners & buttons */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                  <AlignLeft className="h-5 w-5 text-brand-600 shrink-0" />
                  <div>
                    <h2 className="text-[16px] font-black text-slate-900 leading-none">Additional Details</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Requirements & secure verification</p>
                  </div>
                </div>

                <div className="flex flex-col flex-grow">
                  <CustomTextarea
                    label="Message / Integration Requirements"
                    placeholder="Include details about your team size, expected transaction volume, or special integration requests..."
                    value={message}
                    onChange={setMessage}
                    icon={<AlignLeft />}
                  />
                </div>

                {/* Compliance Verification Banner */}
                <div className="bg-[#eff4ff] rounded-xl p-3 flex gap-2.5 items-start border border-[#dbe5ff] text-[11.5px] leading-[1.5] text-brand-900 font-medium">
                  <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Compliance Review:</strong> Verified in all states. Adheres to SEC, MISMO, and secure RON requirements.
                  </span>
                </div>

                {/* Encrypted Disclaimer */}
                <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-[1.4] text-slate-500 font-medium">
                    Closing Engage works with Notarix™ compliance framework to provide secure remote online notarization (RON).
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-3 border-t border-slate-100 mt-auto">
                  <button
                    type="submit"
                    className="group flex-grow h-12 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-[0_8px_16px_rgba(37,99,235,0.12)] transition-all flex items-center justify-center gap-1.5 text-[14px] cursor-pointer"
                  >
                    <span>Submit Request</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-5 h-12 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center text-[14px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full text-center text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] py-2 mt-4">
          © 2026 Notarix™ Technologies Inc. All rights reserved.
        </div>
      </div>
    );
  }

  // Else, role === "notary", render beautiful professional Notary Request Access layout
  const handleNotaryRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notaryFullName || !notaryEmail) {
      toast.error("Please fill in all required fields (Full Name and Email).");
      return;
    }

    // Capture request in localStorage for Admin Dashboard live integration
    try {
      const existingReqs = JSON.parse(localStorage.getItem("registration_requests") || "[]");
      const newReq = {
        id: `REQ-${Date.now()}`,
        role: "notary",
        fullName: notaryFullName,
        email: notaryEmail,
        phone: notaryPhone || "N/A",
        commissionNumber: commissionNumber || "N/A",
        commissionExpiration: commissionExpiration || "N/A",
        eoInsurance: eoInsurance || "N/A",
        certifications: certifications || "N/A",
        coverageArea: notaryCoverageArea || "N/A",
        status: "Pending",
        createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        message: notaryMessage || "No additional comments."
      };
      localStorage.setItem("registration_requests", JSON.stringify([newReq, ...existingReqs]));
    } catch (err) {
      console.error("Failed to write request to localStorage:", err);
    }

    toast.success("Notary application submitted successfully! Our compliance team will verify your credentials.");
    navigate("/notary/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-4 md:py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center font-sans overflow-hidden">
      <div className="w-full max-w-[1140px] flex flex-col items-center flex-grow justify-center my-auto">
        {/* Logo & Header */}
        <div className="flex justify-center mb-3">
          <img
            src="/branding/closing-engage-logo.svg"
            alt="Closing Engage"
            className="h-8 w-auto object-contain"
          />
        </div>
        
        <h1 className="text-center text-[26px] md:text-[30px] font-extrabold tracking-tight text-slate-900 leading-none">
          Request Notary Access
        </h1>
        <p className="mt-2 text-center text-[14px] leading-normal text-slate-500 max-w-[540px] mx-auto font-medium">
          Complete the secure application below to join our premier notary pool and activate your independent workspace.
        </p>

        {/* Compact Form Card with 2-Column Split Layout */}
        <form
          onSubmit={handleNotaryRequestAccess}
          className="mt-4 w-full bg-white rounded-[24px] border border-slate-200/60 shadow-[0_20px_50px_rgba(20,48,112,0.03)] p-6 md:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Column: Form Inputs */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                <UserRound className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <h2 className="text-[16px] font-black text-slate-900 leading-none">Professional Credentials</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Please fill out all identity and commission credentials</p>
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <CustomInput
                  label="Full Name*"
                  placeholder="e.g. Jane Doe"
                  value={notaryFullName}
                  onChange={setNotaryFullName}
                  icon={<UserRound />}
                />
                <CustomInput
                  label="Email Address*"
                  placeholder="jane@notary.com"
                  type="email"
                  value={notaryEmail}
                  onChange={setNotaryEmail}
                  icon={<Mail />}
                />
                <CustomInput
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={notaryPhone}
                  onChange={setNotaryPhone}
                  icon={<Phone />}
                />
                <CustomInput
                  label="Commission Number"
                  placeholder="e.g. COMM123456"
                  value={commissionNumber}
                  onChange={setCommissionNumber}
                  icon={<FileText />}
                />
                <CustomInput
                  label="Commission Expiration"
                  placeholder="MM/DD/YYYY"
                  value={commissionExpiration}
                  onChange={setCommissionExpiration}
                  icon={<FileText />}
                />
                <CustomSelect
                  label="E&O Insurance Coverage"
                  options={[
                    { label: "$25,000 Policy", value: "$25,000" },
                    { label: "$50,000 Policy", value: "$50,000" },
                    { label: "$100,000 Policy", value: "$100,000" },
                    { label: "$100,000+ / Custom Policy", value: "$100,000+" },
                  ]}
                  value={eoInsurance}
                  onChange={setEoInsurance}
                  icon={<Shield />}
                />
                <CustomSelect
                  label="Notary Certifications"
                  options={[
                    { label: "NNA Certified Signing Agent", value: "NNA Certified Signing Agent" },
                    { label: "LSS Certified", value: "LSS Certified" },
                    { label: "RON Certified", value: "RON Certified" },
                    { label: "Dual (NNA + LSS) Certified", value: "Dual (NNA + LSS) Certified" },
                    { label: "Independent Notary Public Only", value: "Independent Notary Public Only" },
                  ]}
                  value={certifications}
                  onChange={setCertifications}
                  icon={<Briefcase />}
                />
                <CustomInput
                  label="State & Coverage Area"
                  placeholder="e.g. Los Angeles County, CA"
                  value={notaryCoverageArea}
                  onChange={setNotaryCoverageArea}
                  icon={<MapPin />}
                />
              </div>
            </div>

            {/* Right Column: Textarea, Warning banners & buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                <AlignLeft className="h-5 w-5 text-brand-600 shrink-0" />
                <div>
                  <h2 className="text-[16px] font-black text-slate-900 leading-none">Credentials & Security</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Requirements & background verification</p>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <CustomTextarea
                  label="Message / Mobile Coverage Details"
                  placeholder="Include details about your mobile equipment (e.g. dual-tray laser printer, mobile scanner), bi-lingual capabilities, or special signing expertise..."
                  value={notaryMessage}
                  onChange={setNotaryMessage}
                  icon={<AlignLeft />}
                />
              </div>

              {/* Credential Verification Banner */}
              <div className="bg-[#eff4ff] rounded-xl p-3 flex gap-2.5 items-start border border-[#dbe5ff] text-[11.5px] leading-[1.5] text-brand-900 font-medium">
                <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Credential Verification:</strong> Closing Engage automatically runs a real-time NNA credentials check, background screening, and commission verification.
                </span>
              </div>

              {/* Insurance & Bond Banner */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-[1.4] text-slate-500 font-medium">
                  Verified notaries must upload valid E&O insurance policy and surety bond certificates to receive live order assignments.
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100 mt-auto">
                <button
                  type="submit"
                  className="group flex-grow h-12 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-[0_8px_16px_rgba(37,99,235,0.12)] transition-all flex items-center justify-center gap-1.5 text-[14px] cursor-pointer"
                >
                  <span>Submit Application</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-5 h-12 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center text-[14px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] py-2 mt-4">
        © 2026 Notarix™ Technologies Inc. All rights reserved.
      </div>
    </div>
  );
}
