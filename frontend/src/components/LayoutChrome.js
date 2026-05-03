"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function LayoutChrome({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const savedFont = localStorage.getItem('krishi_fontsize');
    if (savedFont) {
      document.body.classList.remove('font-small', 'font-large');
      if (savedFont === 'small') document.body.classList.add('font-small');
      if (savedFont === 'large') document.body.classList.add('font-large');
    }

    const savedContrast = localStorage.getItem('krishi_contrast');
    if (savedContrast === 'true') {
      document.body.classList.add('high-contrast');
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