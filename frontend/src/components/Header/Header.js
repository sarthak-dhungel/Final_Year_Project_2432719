'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  
  // Don't show header on these pages
  const noHeaderPages = ['/signin', '/signup', '/auth/signin', '/auth/signup'];
  
  if (noHeaderPages.includes(pathname)) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" fill="white"/>
              <path d="M12 7L9 10H11V14H13V10H15L12 7Z" fill="#2D7A3E"/>
            </svg>
          </div>
          <span className={styles.logoText}>Krishi AI</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/disease-detection" className={styles.navLink}>
            Disease Detection
          </Link>
          <Link href="/soil-analysis" className={styles.navLink}>Soil Analysis</Link>
        </nav>

        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#666" strokeWidth="2"/>
            <path d="M14 14L17 17" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
          />
        </div>
      </div>
    </header>
  );
}