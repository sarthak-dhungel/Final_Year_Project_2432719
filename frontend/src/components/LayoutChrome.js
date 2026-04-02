"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function LayoutChrome({ children }) {
  const pathname = usePathname();

  // Hide header + footer on splash, auth, and admin pages
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