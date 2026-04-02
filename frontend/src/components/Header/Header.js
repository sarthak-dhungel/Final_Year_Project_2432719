'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const noHeaderPages = ['/signin', '/signup', '/auth/signin', '/auth/signup', '/admin'];
  if (noHeaderPages.includes(pathname)) return null;

  const navLinks = [
    { href: '/dashboard', label: 'Home', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { href: '/about', label: 'About', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
    )},
    { href: '/disease-detection', label: 'Disease Detection', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
      </svg>
    )},
    { href: '/soil-analysis', label: 'Soil Analysis', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    )},
  ];

  const handleSignOut = () => {
    setSidebarOpen(false);
    signOut({ callbackUrl: '/signin' });
  };

  const closeSidebar = () => setSidebarOpen(false);

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (session?.user?.email) return session.user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar menu"
            >
              <span className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line1Active : ''}`} />
              <span className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line2Active : ''}`} />
              <span className={`${styles.hamburgerLine} ${sidebarOpen ? styles.line3Active : ''}`} />
            </button>

            <Link href="/dashboard" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" fill="white"/>
                  <path d="M12 7L9 10H11V14H13V10H15L12 7Z" fill="#2D7A3E"/>
                </svg>
              </div>
              <span className={styles.logoText}>Krishi AI</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#999" strokeWidth="2"/>
                <path d="M14 14L17 17" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search..." className={styles.searchInput} />
            </div>

            {session?.user && (
              <Link href="/profile" className={styles.userPill}>
                <div className={styles.userAvatar}>{getUserInitials()}</div>
                <span className={styles.userName}>
                  {session.user.name || session.user.email?.split('@')[0]}
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogoRow}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" fill="white"/>
                <path d="M12 7L9 10H11V14H13V10H15L12 7Z" fill="#2D7A3E"/>
              </svg>
            </div>
            <span className={styles.sidebarLogoText}>Krishi AI</span>
          </div>
          <button className={styles.closeSidebar} onClick={closeSidebar} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {session?.user && (
          <div className={styles.sidebarUserCard}>
            <div className={styles.sidebarAvatar}>{getUserInitials()}</div>
            <div className={styles.sidebarUserInfo}>
              <p className={styles.sidebarUserName}>{session.user.name || 'Farmer'}</p>
              <p className={styles.sidebarUserEmail}>{session.user.email}</p>
            </div>
          </div>
        )}

        <nav className={styles.sidebarNav}>
          <p className={styles.sidebarSectionLabel}>Navigation</p>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sidebarLink} ${pathname === link.href ? styles.sidebarLinkActive : ''}`}
              onClick={closeSidebar}
            >
              <span className={styles.sidebarLinkIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <div className={styles.sidebarDivider} />

          <p className={styles.sidebarSectionLabel}>Account</p>
          <Link
            href="/profile"
            className={`${styles.sidebarLink} ${pathname === '/profile' ? styles.sidebarLinkActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.sidebarLinkIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span>My Profile</span>
          </Link>

          <button className={styles.sidebarLogout} onClick={handleSignOut}>
            <span className={styles.sidebarLinkIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span>Sign Out</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarFooterBadge}>
            <span className={styles.sidebarFooterDot} />
            <span>AI Model Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}