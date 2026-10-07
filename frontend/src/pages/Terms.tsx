import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24 border-b border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-purple/10 via-brand-blue/5 to-transparent pointer-events-none blur-3xl opacity-50" />

      <div className="relative z-10 section-padding max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="label text-white/50 mb-4 tracking-[0.25em]">Legal & Governance</p>
          <h1 className="heading-xl fluid-xl text-white mb-6 font-bold tracking-tight">
            Terms of Use
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mb-4">
            Welcome to Loops Integrated. These terms govern your access to and use of our digital platforms, agency services, and digital products.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
            <span>Last Updated:</span>
            <span className="text-white/70 font-semibold">July 2026</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12 text-white/80">

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              By accessing, browsing, or utilizing the website and digital portals of Loops Integrated (Pvt) Ltd and its international affiliates (Doha, Dubai, Sydney), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you should refrain from using our services.
            </p>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
              2. Intellectual Property Rights
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              All content on this website—including but not limited to brand identity systems, campaign media, 3D renders, video productions, original copy, software code, and UI design frameworks—is the exclusive property of Loops Integrated or its licensing partners.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-white/60 leading-relaxed">
              <li>Reproduction or distribution of agency work without prior written consent is strictly prohibited.</li>
              <li>Client trademarks displayed in case studies belong to their respective corporate owners.</li>
            </ul>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              3. Service Contracts & Scope
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Specific creative, tech development, performance marketing, and event execution engagements are governed by formal Master Services Agreements (MSA), Statements of Work (SOW), or project proposals signed between Loops Integrated and the client. In the event of a conflict between these Terms of Use and a signed SOW, the terms of the SOW shall prevail.
            </p>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
              4. User Conduct & Security
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              When interacting with our digital forms, career submission portals, or interactive widgets, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-white/60 leading-relaxed">
              <li>Submit false, misleading, or fraudulent contact information.</li>
              <li>Attempt to breach or bypass web security controls or rate limiting systems.</li>
              <li>Upload malicious code, viruses, or unverified script payloads.</li>
            </ul>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              5. Limitation of Liability & Governing Law
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Loops Integrated provides website information on an "as-is" basis. We shall not be liable for any indirect or consequential damages arising from site downtime. These terms are governed by the laws of Sri Lanka and relevant international jurisdictions where our regional offices operate.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xs font-mono uppercase text-white/40 mb-1">Legal Inquiries</p>
                <p className="text-sm text-white font-medium">legal@loops.lk · +94 11 432 1000</p>
              </div>
              <Link to="/contact" className="px-6 py-3 bg-white text-brand-dark text-xs font-mono font-bold uppercase rounded-full hover:bg-white/90 transition-colors">
                Contact Legal
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
