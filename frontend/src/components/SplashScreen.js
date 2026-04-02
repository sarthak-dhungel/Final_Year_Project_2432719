'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [showFrame2, setShowFrame2] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);

  const fullText = "KRISHI AI";

  // Mark component as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate particles on client side only
  useEffect(() => {
    if (mounted) {
      setParticles(
        Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 10
        }))
      );
    }
  }, [mounted]);

  // Check if should show splash
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedKrishiAI');
    const isLoggedIn = status === 'authenticated';

    if (hasVisited && isLoggedIn) {
      router.push('/dashboard');
      setShowSplash(false);
    } else if (isLoggedIn) {
      router.push('/dashboard');
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, [status, router]);

  // Auto scroll after 5 seconds
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowFrame2(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing effect for Frame 2
  useEffect(() => {
    if (showFrame2 && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showFrame2, typedText]);

  // Cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      setCursorTrail(prev => [
        ...prev.slice(-10),
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tags = [
    { text: 'Leading', href: '/about' },
    { text: 'Neural', href: '/technology' },
    { text: 'Future', href: '/roadmap' },
    { text: 'Farming', href: '/testimonials' }
  ];

  const handleExploreClick = () => {
    localStorage.setItem('hasVisitedKrishiAI', 'true');
    router.push('/signup');
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!showSplash) return null;

  const frame1Opacity = typeof window !== 'undefined'
    ? Math.max(0, 1 - scrollY / (window.innerHeight * 0.5))
    : 1;
  const frame1Transform = `translateY(${scrollY * 0.5}px)`;

  return (
    <div className={styles.pageWrapper}>
      {/* Cursor Trail */}
      {cursorTrail.map((pos, i) => (
        <div
          key={pos.id}
          className={styles.cursorDot}
          style={{
            left: pos.x,
            top: pos.y,
            animationDuration: '1s',
            opacity: (i + 1) / cursorTrail.length
          }}
        />
      ))}

      {/* Background Image (STATIC, CRISPY) */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/farmer-hero.jpg"
          alt="Farmer in rice field"
          fill
          priority
          quality={100}
          sizes="100vw"
          style={{
            objectPosition: "60%",
            transform: "translateZ(0)",
            filter: "brightness(0.74) contrast(1.15) saturate(0.9)"
          }}
        />

        {/* Very light overlay */}
        <div className={styles.backgroundOverlay} />
      </div>

      {/* Floating Particles */}
      {mounted && particles.map(particle => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* FRAME 1: Hero Section */}
      <section
        className={styles.heroSection}
        style={{
          opacity: frame1Opacity,
          transform: frame1Transform
        }}
      >
        {/* Main Headline */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadingLeft}>
            Better Health
          </h1>
          <h1 className={styles.heroHeadingRight}>
            Higher Yield
          </h1>
        </div>

        {/* Floating Tags */}
        <div className={styles.tagsOverlay}>
          <a href={tags[0].href} className={`${styles.tagLink} ${styles.tagLink1}`}>
            <div className={styles.tagPill}>
              <span className={styles.tagText}>{tags[0].text}</span>
            </div>
          </a>

          <a href={tags[1].href} className={`${styles.tagLink} ${styles.tagLink2}`}>
            <div className={`${styles.tagPill} ${styles.tagPillDelay500}`}>
              <span className={styles.tagText}>{tags[1].text}</span>
            </div>
          </a>

          <a href={tags[2].href} className={`${styles.tagLink} ${styles.tagLink3}`}>
            <div className={`${styles.tagPill} ${styles.tagPillDelay1000}`}>
              <span className={styles.tagText}>{tags[2].text}</span>
            </div>
          </a>

          <a href={tags[3].href} className={`${styles.tagLink} ${styles.tagLink4}`}>
            <div className={`${styles.tagPill} ${styles.tagPillDelay1500}`}>
              <span className={styles.tagText}>{tags[3].text}</span>
            </div>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* FRAME 2: Landing Section */}
      <section className={styles.landingSection}>
        <div className={styles.landingContent}>
          <p className={`${styles.welcomeText} ${showFrame2 ? styles.welcomeTextVisible : styles.welcomeTextHidden}`}>
            WELCOME TO KRISHI AI
          </p>

          <div className={styles.typedWrapper}>
            <h1 className={styles.typedHeading}>
              {typedText}
              <span className={styles.typedCursor}>|</span>
            </h1>

            <div className={`${styles.starsWrapper} ${showFrame2 ? styles.starsVisible : styles.starsHidden}`}>
              <div className={styles.starsInner}>
                <div className={styles.star1} />
                <div className={styles.star2} />
                <div className={styles.star3} />
              </div>
            </div>
          </div>

          <p className={`${styles.landingDescription} ${showFrame2 ? styles.landingDescVisible : styles.landingDescHidden}`}>
            Empowering Farmers with AI-Driven Solutions.<br />
            Detect crop diseases, analyze soil, and grow smarter<br />
            all with the power of AI, built for Nepal&apos;s farmers.
          </p>

          <button
            onClick={handleExploreClick}
            className={`${styles.exploreButton} ${showFrame2 ? styles.exploreButtonVisible : styles.exploreButtonHidden}`}
          >
            <span className={styles.exploreButtonText}>Explore</span>
            <div className={styles.exploreButtonOverlay} />
          </button>
        </div>
      </section>
    </div>
  );
}
