import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24 border-b border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-pink/10 via-brand-purple/5 to-transparent pointer-events-none blur-3xl opacity-50" />

      <div className="relative z-10 section-padding max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="label text-white/50 mb-4 tracking-[0.25em]">Legal & Transparency</p>
          <h1 className="heading-xl fluid-xl text-white mb-6 font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mb-4">
            At Loops Integrated, we prioritize transparency and the protection of your personal and enterprise data across all our digital touchpoints.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
            <span>Last Updated:</span>
            <span className="text-white/70 font-semibold">July 2026</span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12 text-white/80">

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
              1. Information We Collect
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              We collect information to provide high-quality integrated marketing, technology, and creative services. The types of data we gather include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-white/60 leading-relaxed">
              <li><strong className="text-white/80">Direct Submissions:</strong> Contact form details (name, business email, company name, selected service, project description).</li>
              <li><strong className="text-white/80">Subscriptions:</strong> Email addresses submitted to our "Stay in the Loop" newsletter system.</li>
              <li><strong className="text-white/80">Career Applications:</strong> Resumes, portfolios, and contact information submitted via job applications.</li>
              <li><strong className="text-white/80">Automated Technical Data:</strong> IP addresses, browser types, device information, and interaction telemetry collected via standard web analytics.</li>
            </ul>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
              2. How We Use Your Information
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              We utilize collected information strictly for operational and communication purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-white/60 leading-relaxed">
              <li>Responding to service enquiries, RFP requests, and project consultation bookings.</li>
              <li>Delivering curated agency newsletters, campaign case studies, and industry insights.</li>
              <li>Evaluating candidate suitability for open career positions.</li>
              <li>Improving website accessibility, performance, and user navigation experience.</li>
            </ul>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              3. Client Confidentiality & Data Protection
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              We understand the sensitive nature of brand strategy and proprietary assets. Loops Integrated maintains strict Non-Disclosure Agreement (NDA) compliance. We enforce SSL encryption, restricted administrative role-based access, and robust data retention protocols. We <strong className="text-white">never sell, rent, or trade</strong> personal or business data to third parties.
            </p>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
              4. Cookies & Web Telemetry
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Our website uses essential and performance cookies to optimize page load speed and track anonymous traffic trends. You can control or disable cookies through your web browser preferences at any time.
            </p>
          </section>

          <section className="bg-neutral-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              5. Your Rights & Enquiries
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              You have the right to request access to, correction of, or deletion of your personal data stored in our systems at any time. You may also unsubscribe from our newsletter with a single click.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xs font-mono uppercase text-white/40 mb-1">Privacy Contact</p>
                <p className="text-sm text-white font-medium">privacy@loops.lk · +94 11 432 1000</p>
              </div>
              <Link to="/contact" className="px-6 py-3 bg-white text-brand-dark text-xs font-mono font-bold uppercase rounded-full hover:bg-white/90 transition-colors">
                Contact Us
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
