'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on these pages
  const noFooterPages = ['/signin', '/signup', '/auth/signin', '/auth/signup'];
  
  if (noFooterPages.includes(pathname)) {
    return null;
  }

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Krishi AI</h4>
            <p className={styles.footerDescription}>
              Empowering farmers with AI-powered agricultural solutions for better crop 
              management and sustainable farming.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/disease-detection">Disease Detection</Link></li>
              <li><Link href="/soil-analysis">Soil Analysis</Link></li>
              <li><Link href="/weather">Weather</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/community">Community Forum</Link></li>
              <li><Link href="/reports">Reports & History</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact</h4>
            <ul className={styles.contactList}>
              <li>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4L8 8L14 4M2 4V12H14V4" stroke="#2D7A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>+977 9800000000</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="10" rx="1" stroke="#2D7A3E" strokeWidth="1.5"/>
                  <path d="M2 6L8 9L14 6" stroke="#2D7A3E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>support@krishiai.com</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#2D7A3E" strokeWidth="1.5"/>
                  <path d="M8 5V8L10 10" stroke="#2D7A3E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 Krishi AI. All rights reserved. Made with 🌱 for farmers.
          </p>
        </div>
      </footer>
    </>
  );
}