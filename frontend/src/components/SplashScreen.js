'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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

    document.body.style.transform = 'translateX(-100%)';
    document.body.style.transition = 'transform 0.6s ease-in-out';

    setTimeout(() => {
      router.push('/signup');
    }, 600);
  };

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 to-black/60 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!showSplash) return null;

  const frame1Opacity = typeof window !== 'undefined'
    ? Math.max(0, 1 - scrollY / (window.innerHeight * 0.5))
    : 1;
  const frame1Transform = `translateY(${scrollY * 0.5}px)`;

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Cursor Trail */}
      {cursorTrail.map((pos, i) => (
        <div
          key={pos.id}
          className="pointer-events-none fixed w-2 h-2 rounded-full bg-green-400/30 -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: pos.x,
            top: pos.y,
            animationDuration: '1s',
            opacity: (i + 1) / cursorTrail.length
          }}
        />
      ))}

      {/* Background Image (STATIC, CRISPY) */}
      <div className="fixed inset-0 w-full h-screen -z-10">
  <Image
    src="/farmer-hero.jpg"
    alt="Farmer in rice field"
    fill
    priority
    quality={100}
    sizes="100vw"
    className="object-cover"
    style={{
      objectPosition: "60%",
      transform: "translateZ(0)",
      filter: "brightness(0.74) contrast(1.15) saturate(0.9)"
    }}
  />

  {/* Very light overlay – do NOT increase this */}
  <div className="absolute inset-0 bg-black/15" />
</div>

      {/* Floating Particles */}
      {mounted && particles.map(particle => (
        <div
          key={particle.id}
          className="fixed w-1 h-1 bg-white/40 rounded-full animate-float"
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
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: frame1Opacity,
          transform: frame1Transform
        }}
      >
        {/* Main Headline */}
        <div className="text-center space-y-8 px-8 z-10">
          <h1
            className="text-8xl font-bold leading-tight tracking-tight animate-slide-in-left"
            style={{ color: '#BFE4C7' }}
          >
            Better Health
          </h1>
          <h1
            className="text-8xl font-bold leading-tight tracking-tight animate-slide-in-right animation-delay-300"
            style={{ color: '#BFE4C7' }}
          >
            Higher Yield
          </h1>
        </div>

        {/* Floating Tags */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <a
            href={tags[0].href}
            className="absolute top-[30%] left-[25%] pointer-events-auto group"
          >
            <div className="px-8 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 
                          hover:bg-white/30 hover:scale-110 transition-all duration-300
                          hover:shadow-lg hover:shadow-green-500/50 animate-float">
              <span className="text-lg font-medium tracking-wide" style={{ color: '#8BF282' }}>
                {tags[0].text}
              </span>
            </div>
          </a>

          <a
            href={tags[1].href}
            className="absolute top-[30%] right-[25%] pointer-events-auto group"
          >
            <div className="px-8 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 
                          hover:bg-white/30 hover:scale-110 transition-all duration-300
                          hover:shadow-lg hover:shadow-blue-500/50 animate-float animation-delay-500">
              <span className="text-lg font-medium tracking-wide" style={{ color: '#8BF282' }}>
                {tags[1].text}
              </span>
            </div>
          </a>

          <a
            href={tags[2].href}
            className="absolute bottom-[30%] right-[20%] pointer-events-auto group"
          >
            <div className="px-8 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 
                          hover:bg-white/30 hover:scale-110 transition-all duration-300
                          hover:shadow-lg hover:shadow-purple-500/50 animate-float animation-delay-1000">
              <span className="text-lg font-medium tracking-wide" style={{ color: '#8BF282' }}>
                {tags[2].text}
              </span>
            </div>
          </a>

          <a
            href={tags[3].href}
            className="absolute bottom-[25%] left-[50%] -translate-x-1/2 pointer-events-auto group"
          >
            <div className="px-8 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 
                          hover:bg-white/30 hover:scale-110 transition-all duration-300
                          hover:shadow-lg hover:shadow-yellow-500/50 animate-float animation-delay-1500">
              <span className="text-lg font-medium tracking-wide" style={{ color: '#8BF282' }}>
                {tags[3].text}
              </span>
            </div>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="opacity-70"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* FRAME 2: Landing Section */}
      <section className="relative h-screen w-full flex flex-col items-start justify-center px-20 z-10">
        <div className="max-w-2xl space-y-8">
          <p className={`text-white text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-700 ${showFrame2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            WELCOME TO KRISHI AI
          </p>

          <div className="relative">
            <h1 className="text-9xl font-bold text-white leading-none tracking-tight">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>

            <div className={`absolute -right-20 top-4 transition-all duration-1000 ${showFrame2 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
              }`}>
              <div className="relative w-16 h-16">
                <div className="absolute w-0 h-0 border-l-[30px] border-l-transparent border-b-[52px] border-b-orange-400 border-r-[30px] border-r-transparent rotate-45 animate-pulse" />
                <div className="absolute w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-orange-500 border-r-[20px] border-r-transparent rotate-12 top-2 left-8 animation-delay-300 animate-pulse" />
                <div className="absolute w-0 h-0 border-l-[15px] border-l-transparent border-b-[26px] border-b-orange-300 border-r-[15px] border-r-transparent -rotate-30 top-8 left-2 animation-delay-600 animate-pulse" />
              </div>
            </div>
          </div>

          <p className={`text-white text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-500 ${showFrame2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            Empowering Farmers with AI-Driven Solutions.<br />
            Detect crop diseases, analyze soil, and grow smarter<br />
            all with the power of AI, built for Nepal's farmers.
          </p>

          <button
            onClick={handleExploreClick}
            className={`group relative px-12 py-4 bg-gradient-to-r from-orange-400 to-orange-500 
                       rounded-full text-white font-semibold text-lg
                       hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105
                       transition-all duration-300 overflow-hidden
                       ${showFrame2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                       animation-delay-1000`}
          >
            <span className="relative z-10">Explore</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 
                          translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </section>
    </div>
  );
}
