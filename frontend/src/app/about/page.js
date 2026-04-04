'use client';

import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* ============ HERO ============ */}
        <section className={styles.heroSection}>

          {/* Left */}
          <div>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z"/>
              </svg>
              About Krishi AI
            </div>

            <h1 className={styles.heroTitle}>
              Empowering Nepali Farmers with{' '}
              <span className={styles.heroTitleAccent}>AI Technology</span>
            </h1>

            <p className={styles.heroDescription}>
              Krishi AI is a bilingual agricultural intelligence platform that combines
              deep learning-based plant disease detection with real-time IoT soil monitoring —
              designed specifically for the farming communities of Nepal.
            </p>

            <div className={styles.heroButtons}>
              <Link href="/disease-detection" className={styles.btnPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                </svg>
                Try Disease Detection
              </Link>
              <Link href="/soil-analysis" className={styles.btnSecondary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                Soil Analysis
              </Link>
            </div>
          </div>

          {/* Right — stats card */}
          <div className={styles.statsWrapper}>
            {/* Floating badge top */}
            <div className={styles.floatingBadgeTop}>
              <span className={styles.statusDotGreen}></span>
              AI Model Active
            </div>

            <div className={styles.statsCard}>
              {/* Gradient top border */}
              <div className={styles.statsCardBorder}></div>

              <p className={styles.statsLabel}>Platform at a Glance</p>

              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <div className={styles.statIconGreen}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.statNumber}>38</div>
                    <div className={styles.statDesc}>Disease classes detected</div>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statIconYellow}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.statNumber}>NPK+</div>
                    <div className={styles.statDesc}>Real-time soil monitoring</div>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statIconBlue}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.statNumber}>2</div>
                    <div className={styles.statDesc}>Languages — Nepali &amp; English</div>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statIconPurple}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.statNumber}>PlantVillage</div>
                    <div className={styles.statDesc}>Training dataset</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge bottom */}
            <div className={styles.floatingBadgeBottom}>
              <span className={styles.statusDotYellow}></span>
              Arduino Nano IoT
            </div>
          </div>
        </section>

        {/* ============ MISSION ============ */}
        <section className={styles.section}>
          <SectionHeader label="Our Mission" title="Built for Nepal's Farmers" subtitle="We bridge the gap between cutting-edge AI research and the everyday challenges faced by smallholder farmers across Nepal." />
          <div className={styles.grid3}>
            <div className={styles.missionCard}>
              <div className={`${styles.missionIcon} ${styles.iconGreen}`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z"/></svg>
              </div>
              <h3 className={styles.cardTitle}>Accessible Technology</h3>
              <p className={styles.cardText}>A bilingual interface in Nepali and English ensures that farmers can access AI-driven insights regardless of their language preference, reducing the digital divide in agricultural communities.</p>
            </div>

            <div className={styles.missionCard}>
              <div className={`${styles.missionIcon} ${styles.iconYellow}`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className={styles.cardTitle}>Early Disease Detection</h3>
              <p className={styles.cardText}>By identifying crop diseases early through deep learning, farmers can apply targeted treatments before infections spread — reducing crop loss and cutting unnecessary pesticide use.</p>
            </div>

            <div className={styles.missionCard}>
              <div className={`${styles.missionIcon} ${styles.iconBlue}`}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3 className={styles.cardTitle}>Data-Driven Decisions</h3>
              <p className={styles.cardText}>Real-time soil data from Arduino Nano IoT sensors gives farmers actionable insights about their land&apos;s health — nitrogen, phosphorus, potassium, pH, moisture, and temperature.</p>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className={styles.section}>
          <SectionHeader label="How It Works" title="From Photo to Treatment in Seconds" subtitle="Our streamlined pipeline takes a leaf photo and returns a full diagnosis with Nepal-specific organic and chemical treatment recommendations." />
          <div className={styles.grid4}>
            {/* Connecting line — desktop only */}
            <div className={styles.connectingLine}></div>
            {[
              { n: '1', title: 'Upload a Photo',   text: 'Take a clear photo of the affected leaf and upload it via drag-and-drop or browse.' },
              { n: '2', title: 'AI Analysis',       text: 'Our TorchScript CNN model processes the image and classifies it against 38 disease categories.' },
              { n: '3', title: 'Get Results',       text: 'Receive a confidence-scored diagnosis with severity level and symptom description.' },
              { n: '4', title: 'Apply Treatment',   text: 'Follow tailored organic, chemical, and prevention guidance sourced for Nepali farmers.' },
            ].map((s, i) => (
              <div key={i} className={styles.stepItem}>
                <div className={styles.stepCircle}>{s.n}</div>
                <h4 className={styles.stepTitle}>{s.title}</h4>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section className={styles.section}>
          <SectionHeader label="Features" title="Everything a Farmer Needs" subtitle="Krishi AI combines AI, IoT, and local agricultural knowledge into one unified platform." />
          <div className={styles.grid2}>
            {[
              {
                iconClass: styles.iconGreen,
                icon: <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>,
                title: 'CNN Plant Disease Detection',
                text: 'EfficientNet-B3 transfer learning model trained on PlantVillage. Detects 38 disease classes across major crops with top-3 confidence scoring.'
              },
              {
                iconClass: styles.iconYellow,
                icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>,
                title: 'IoT Soil Monitoring',
                text: 'Arduino Nano with NPK sensor and MAX485 Modbus module for real-time readings of soil nitrogen, phosphorus, potassium, pH, moisture, and temperature.'
              },
              {
                iconClass: styles.iconBlue,
                icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
                title: 'Bilingual Interface',
                text: 'Full Nepali and English support across the entire platform — from disease names and treatment instructions to UI labels and recommendations.'
              },
              {
                iconClass: styles.iconPurple,
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
                title: 'Nepal-Specific Remedies',
                text: '38 curated disease profiles with organic treatments (neem oil, Bordeaux mixture, cow urine spray) and locally available chemical treatments with dosage guides.'
              },
              {
                iconClass: styles.iconTeal,
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                title: 'Secure Authentication',
                text: 'Email/password login with Argon2 hashing, Google OAuth integration, OTP-based password reset, and persistent 7-day JWT sessions via NextAuth.js.'
              },
              {
                iconClass: styles.iconRed,
                icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
                title: 'Admin Dashboard',
                text: 'Configurable soil threshold management, diagnosis history, user CRUD operations, and system monitoring through a secure admin panel.'
              },
            ].map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={`${styles.featureIcon} ${f.iconClass}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{f.icon}</svg>
                </div>
                <div>
                  <h4 className={styles.featureTitle}>{f.title}</h4>
                  <p className={styles.featureText}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ TEAM ============ */}
        <section className={styles.section}>
          <SectionHeader label="The Team" title="Who Built Krishi AI" subtitle="Developed at Herald College Kathmandu in partnership with the University of Wolverhampton." />
          <div className={styles.grid3}>
            {[
              {
                initials: 'SD', gradient: styles.gradientGreen,
                name: 'Sarthak Dhungel', role: 'Developer & Researcher',
                bio: 'Final year student (ID: 2432719) at Herald College Kathmandu / University of Wolverhampton. Designed and built the full-stack platform, AI pipeline, and IoT integration.'
              },
              {
                initials: 'SU', gradient: styles.gradientOrange,
                name: 'Mr. Sujan Upreti', role: 'Project Supervisor',
                bio: 'Provided academic supervision and technical guidance throughout the project, helping shape the research direction and system architecture decisions.'
              },
              {
                initials: 'SG', gradient: styles.gradientBlue,
                name: 'Ms. Sarayu Gautam', role: 'Project Reader',
                bio: 'Reviewed and evaluated the project\'s academic and technical quality, providing feedback across the proposal, literature review, and final report.'
              },
            ].map((t, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={`${styles.teamAvatar} ${t.gradient}`}>
                  {t.initials}
                </div>
                <h3 className={styles.teamName}>{t.name}</h3>
                <p className={styles.teamRole}>{t.role}</p>
                <p className={styles.teamBio}>{t.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ TECH STACK ============ */}
        <section className={styles.section}>
          <SectionHeader label="Tech Stack" title="Built With Modern Tools" subtitle="A carefully chosen stack balancing performance, developer experience, and scalability." />
          <div className={styles.grid4Tech}>
            {[
              { iconClass: styles.iconSlate,  name: 'Next.js 14',    desc: 'App Router frontend',
                icon: <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></> },
              { iconClass: styles.iconBlue,   name: 'React 18',      desc: 'UI component library',
                icon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></> },
              { iconClass: styles.iconGreen,  name: 'FastAPI',       desc: 'Python 3.12 backend',
                icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> },
              { iconClass: styles.iconTeal,   name: 'MongoDB',       desc: 'Motor async driver',
                icon: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></> },
              { iconClass: styles.iconOrange, name: 'PyTorch 2.1',   desc: 'AI model inference',
                icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { iconClass: styles.iconPurple, name: 'NextAuth.js',   desc: 'Auth & sessions',
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
              { iconClass: styles.iconYellow, name: 'Arduino Nano',  desc: 'IoT soil sensors',
                icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
              { iconClass: styles.iconRed,    name: 'PlantVillage',  desc: 'Training dataset',
                icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></> },
            ].map((t, i) => (
              <div key={i} className={styles.techCard}>
                <div className={`${styles.techIcon} ${t.iconClass}`}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{t.icon}</svg>
                </div>
                <div className={styles.techName}>{t.name}</div>
                <div className={styles.techDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className={styles.ctaSection}>
          {/* Decorative circles */}
          <div className={styles.ctaCircle1}></div>
          <div className={styles.ctaCircle2}></div>

          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Protect Your Crops?</h2>
            <p className={styles.ctaText}>
              Upload a leaf photo and get an AI-powered diagnosis with treatment recommendations in seconds — completely free.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/disease-detection" className={styles.ctaBtnPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                </svg>
                Start Scanning Now
              </Link>
              <Link href="/dashboard" className={styles.ctaBtnSecondary}>
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
    </div>
  );
}

/* ---------- Reusable section header ---------- */
function SectionHeader({ label, title, subtitle }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionBadge}>{label}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSubtitle}>{subtitle}</p>
    </div>
  );
}
