"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useEffect } from 'react';

export default function LayoutChrome({ children }) {
  const pathname = usePathname();

  // Apply saved font size on every page load
  useEffect(() => {
    const saved = localStorage.getItem('krishi_fontsize');
    if (saved) {
      document.body.classList.remove('font-small', 'font-large');
      if (saved === 'small') document.body.classList.add('font-small');
      if (saved === 'large') document.body.classList.add('font-large');
    }
  }, []);

  const hideChrome =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/admin";

  return (
    <>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}