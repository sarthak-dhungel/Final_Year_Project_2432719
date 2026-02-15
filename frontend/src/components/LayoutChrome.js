"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function LayoutChrome({ children }) {
  const pathname = usePathname();

  // Hide navbar + footer ONLY on these pages 
   const hideChrome = pathname === "/" || pathname === "/forgot-password";;

  return (
    <>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
