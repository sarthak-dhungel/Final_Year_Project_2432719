'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] to-[#e8dcc4] font-sans">
      <main className="max-w-6xl mx-auto px-12 py-16 pb-24">

        {/* ============ HERO ============ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 animate-[fadeUp_0.7s_ease-out]">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e8f5e0] text-[#2d5016] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#c6e0b0] mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z"/>
              </svg>
              About Krishi AI
            </div>

            <h1 className="text-5xl font-extrabold text-[#1a202c] leading-tight tracking-tight mb-5">
              Empowering Nepali Farmers with{' '}
              <span className="text-[#2D7A3E]">AI Technology</span>
            </h1>

            <p className="text-lg text-[#4a5568] leading-relaxed mb-9">
              Krishi AI is a bilingual agricultural intelligence platform that combines
              deep learning-based plant disease detection with real-time IoT soil monitoring —
              designed specifically for the farming communities of Nepal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/disease-detection"
                className="inline-flex items-center gap-2 bg-[#2d5016] hover:bg-[#1f3a0f] text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d5016]/30 no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                </svg>
                Try Disease Detection
              </Link>
              <Link
                href="/soil-analysis"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#f0faf0] text-[#2d5016] px-7 py-3.5 rounded-xl text-sm font-semibold border-2 border-[#c6e0b0] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d5016]/10 no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                Soil Analysis
              </Link>
            </div>
          </div>

          {/* Right — stats card */}
          <div className="relative">
            {/* Floating badge top */}
            <div className="absolute -top-5 right-6 z-10 hidden md:flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-xl text-sm font-semibold text-[#1a202c] animate-[float_4s_ease-in-out_infinite]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              AI Model Active
            </div>

            <div className="bg-white rounded-3xl p-9 shadow-2xl shadow-black/10 relative overflow-hidden">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D7A3E] via-[#7fb069] to-[#d4a574] rounded-t-3xl"></div>

              <p className="text-xs font-semibold text-[#718096] uppercase tracking-widest mb-6">Platform at a Glance</p>

              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>,
                    icon2: <polyline points="22 4 12 14.01 9 11.01"/>,
                    bg: 'bg-[#e8f5e0]', color: 'text-[#2D7A3E]',
                    number: '38', desc: 'Disease classes detected'
                  },
                  {
                    icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>,
                    bg: 'bg-[#fef3cd]', color: 'text-[#d97706]',
                    number: 'NPK+', desc: 'Real-time soil monitoring'
                  },
                  {
                    icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
                    bg: 'bg-[#e0f2fe]', color: 'text-[#0284c7]',
                    number: '2', desc: 'Languages — Nepali & English'
                  },
                  {
                    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
                    bg: 'bg-[#f3e8ff]', color: 'text-[#7c3aed]',
                    number: 'PlantVillage', desc: 'Training dataset'
                  },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#f7f3ed] rounded-xl p-4 transition-transform duration-200 hover:translate-x-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg} ${s.color}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {s.icon}{s.icon2}
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#1a202c] leading-none mb-0.5">{s.number}</div>
                      <div className="text-xs text-[#718096] font-medium">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge bottom */}
            <div className="absolute -bottom-5 left-6 z-10 hidden md:flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-xl text-sm font-semibold text-[#1a202c] animate-[float_4s_ease-in-out_2s_infinite]">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
              Arduino Nano IoT
            </div>
          </div>
        </section>

        {/* ============ MISSION ============ */}
        <section className="mb-20">
          <SectionHeader label="Our Mission" title="Built for Nepal's Farmers" subtitle="We bridge the gap between cutting-edge AI research and the everyday challenges faced by smallholder farmers across Nepal." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                color: 'bg-[#e8f5e0] text-[#2D7A3E]',
                border: 'hover:border-[#7fb069]',
                icon: <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z"/>,
                title: 'Accessible Technology',
                text: 'A bilingual interface in Nepali and English ensures that farmers can access AI-driven insights regardless of their language preference, reducing the digital divide in agricultural communities.'
              },
              {
                color: 'bg-[#fef3cd] text-[#d97706]',
                border: 'hover:border-[#f4d89a]',
                icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>,
                title: 'Early Disease Detection',
                text: 'By identifying crop diseases early through deep learning, farmers can apply targeted treatments before infections spread — reducing crop loss and cutting unnecessary pesticide use.'
              },
              {
                color: 'bg-[#e0f2fe] text-[#0284c7]',
                border: 'hover:border-[#bae6fd]',
                icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
                title: 'Data-Driven Decisions',
                text: 'Real-time soil data from Arduino Nano IoT sensors gives farmers actionable insights about their land\'s health — nitrogen, phosphorus, potassium, pH, moisture, and temperature.'
              },
            ].map((c, i) => (
              <div key={i} className={`bg-white rounded-2xl p-9 shadow-sm border-2 border-transparent ${c.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${c.color}`}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{c.icon}</svg>
                </div>
                <h3 className="text-lg font-bold text-[#1a202c] mb-2.5">{c.title}</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="mb-20">
          <SectionHeader label="How It Works" title="From Photo to Treatment in Seconds" subtitle="Our streamlined pipeline takes a leaf photo and returns a full diagnosis with Nepal-specific organic and chemical treatment recommendations." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            {/* Connecting line — desktop only */}
            <div className="absolute top-9 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-[#c6e0b0] via-[#7fb069] to-[#c6e0b0] hidden md:block z-0"></div>
            {[
              { n: '1', title: 'Upload a Photo',   text: 'Take a clear photo of the affected leaf and upload it via drag-and-drop or browse.' },
              { n: '2', title: 'AI Analysis',       text: 'Our TorchScript CNN model processes the image and classifies it against 38 disease categories.' },
              { n: '3', title: 'Get Results',       text: 'Receive a confidence-scored diagnosis with severity level and symptom description.' },
              { n: '4', title: 'Apply Treatment',   text: 'Follow tailored organic, chemical, and prevention guidance sourced for Nepali farmers.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 relative z-10">
                <div className="w-[72px] h-[72px] rounded-full bg-white border-[3px] border-[#7fb069] flex items-center justify-center mb-5 text-2xl font-extrabold text-[#2D7A3E] shadow-lg shadow-[#7fb069]/25 transition-all duration-300 hover:bg-[#2D7A3E] hover:text-white hover:scale-110 hover:shadow-[#2D7A3E]/35 cursor-default">
                  {s.n}
                </div>
                <h4 className="text-sm font-bold text-[#1a202c] mb-2">{s.title}</h4>
                <p className="text-xs text-[#718096] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section className="mb-20">
          <SectionHeader label="Features" title="Everything a Farmer Needs" subtitle="Krishi AI combines AI, IoT, and local agricultural knowledge into one unified platform." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                bg: 'bg-[#e8f5e0] text-[#2D7A3E]',
                icon: <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>,
                title: 'CNN Plant Disease Detection',
                text: 'EfficientNet-B3 transfer learning model trained on PlantVillage. Detects 38 disease classes across major crops with top-3 confidence scoring.'
              },
              {
                bg: 'bg-[#fef3cd] text-[#d97706]',
                icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>,
                title: 'IoT Soil Monitoring',
                text: 'Arduino Nano with NPK sensor and MAX485 Modbus module for real-time readings of soil nitrogen, phosphorus, potassium, pH, moisture, and temperature.'
              },
              {
                bg: 'bg-[#e0f2fe] text-[#0284c7]',
                icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
                title: 'Bilingual Interface',
                text: 'Full Nepali and English support across the entire platform — from disease names and treatment instructions to UI labels and recommendations.'
              },
              {
                bg: 'bg-[#f3e8ff] text-[#7c3aed]',
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
                title: 'Nepal-Specific Remedies',
                text: '38 curated disease profiles with organic treatments (neem oil, Bordeaux mixture, cow urine spray) and locally available chemical treatments with dosage guides.'
              },
              {
                bg: 'bg-[#ccfbf1] text-[#0d9488]',
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                title: 'Secure Authentication',
                text: 'Email/password login with Argon2 hashing, Google OAuth integration, OTP-based password reset, and persistent 7-day JWT sessions via NextAuth.js.'
              },
              {
                bg: 'bg-[#ffe4e6] text-[#e11d48]',
                icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
                title: 'Admin Dashboard',
                text: 'Configurable soil threshold management, diagnosis history, user CRUD operations, and system monitoring through a secure admin panel.'
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm flex gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                <div className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl flex items-center justify-center ${f.bg}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{f.icon}</svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1a202c] mb-2">{f.title}</h4>
                  <p className="text-sm text-[#4a5568] leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ TEAM ============ */}
        <section className="mb-20">
          <SectionHeader label="The Team" title="Who Built Krishi AI" subtitle="Developed at Herald College Kathmandu in partnership with the University of Wolverhampton." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                initials: 'SD', gradient: 'from-[#2D7A3E] to-[#7fb069]',
                name: 'Sarthak Dhungel', role: 'Developer & Researcher',
                bio: 'Final year student (ID: 2432719) at Herald College Kathmandu / University of Wolverhampton. Designed and built the full-stack platform, AI pipeline, and IoT integration.'
              },
              {
                initials: 'SU', gradient: 'from-[#d97706] to-[#f59e0b]',
                name: 'Mr. Sujan Upreti', role: 'Project Supervisor',
                bio: 'Provided academic supervision and technical guidance throughout the project, helping shape the research direction and system architecture decisions.'
              },
              {
                initials: 'SG', gradient: 'from-[#0284c7] to-[#38bdf8]',
                name: 'Ms. Sarayu Gautam', role: 'Project Reader',
                bio: 'Reviewed and evaluated the project\'s academic and technical quality, providing feedback across the proposal, literature review, and final report.'
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl px-7 py-9 shadow-sm text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold text-white`}>
                  {t.initials}
                </div>
                <h3 className="text-lg font-bold text-[#1a202c] mb-1">{t.name}</h3>
                <p className="text-xs font-bold text-[#2D7A3E] uppercase tracking-widest mb-3">{t.role}</p>
                <p className="text-sm text-[#718096] leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ TECH STACK ============ */}
        <section className="mb-20">
          <SectionHeader label="Tech Stack" title="Built With Modern Tools" subtitle="A carefully chosen stack balancing performance, developer experience, and scalability." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { bg: 'bg-[#f1f5f9] text-[#334155]', name: 'Next.js 14',     desc: 'App Router frontend',
                icon: <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></> },
              { bg: 'bg-[#e0f2fe] text-[#0284c7]', name: 'React 18',       desc: 'UI component library',
                icon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></> },
              { bg: 'bg-[#e8f5e0] text-[#2D7A3E]', name: 'FastAPI',        desc: 'Python 3.12 backend',
                icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> },
              { bg: 'bg-[#ccfbf1] text-[#0d9488]', name: 'MongoDB',        desc: 'Motor async driver',
                icon: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></> },
              { bg: 'bg-[#fff7ed] text-[#ea580c]', name: 'PyTorch 2.1',    desc: 'AI model inference',
                icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { bg: 'bg-[#f3e8ff] text-[#7c3aed]', name: 'NextAuth.js',   desc: 'Auth & sessions',
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
              { bg: 'bg-[#fef3cd] text-[#d97706]', name: 'Arduino Nano',   desc: 'IoT soil sensors',
                icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
              { bg: 'bg-[#ffe4e6] text-[#e11d48]', name: 'PlantVillage',   desc: 'Training dataset',
                icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></> },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl flex items-center justify-center mx-auto mb-3.5 ${t.bg}`}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{t.icon}</svg>
                </div>
                <div className="text-sm font-bold text-[#1a202c] mb-1">{t.name}</div>
                <div className="text-xs text-[#718096]">{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="relative bg-gradient-to-br from-[#2d5016] via-[#2D7A3E] to-[#7fb069] rounded-3xl px-12 py-16 text-center text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/[0.04] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-3">Ready to Protect Your Crops?</h2>
            <p className="text-lg opacity-85 max-w-md mx-auto leading-relaxed mb-9">
              Upload a leaf photo and get an AI-powered diagnosis with treatment recommendations in seconds — completely free.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/disease-detection"
                className="inline-flex items-center gap-2 bg-white text-[#2d5016] px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                </svg>
                Start Scanning Now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/50 hover:border-white/80 hover:bg-white/10 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 no-underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Reusable section header ---------- */
function SectionHeader({ label, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block bg-[#e8f5e0] text-[#2d5016] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#c6e0b0] mb-4">
        {label}
      </span>
      <h2 className="text-4xl font-extrabold text-[#1a202c] tracking-tight mb-3">{title}</h2>
      <p className="text-base text-[#718096] max-w-xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );
}