"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Works" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 48) {
        setIsVisible(true);
      } else if (delta > 5) {
        setIsVisible(false);
      } else if (delta < -5) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    if (href === "/products") return pathname.startsWith("/products");
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-white/85 dark:bg-black/85 backdrop-blur-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/android-icon-192x192.png"
            alt="icon"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-bold">パリッと開発日記</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-[14px] py-[5px] text-[13px] transition-colors duration-150 ${
                isActive(href)
                  ? "bg-[rgba(12,197,176,0.08)] text-[#0CC5B0]"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/8"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="mx-2 h-4 w-px bg-border" />
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
            aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-border bg-white/85 dark:bg-black/85 backdrop-blur-md px-4 py-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 ${
                isActive(href)
                  ? "bg-[rgba(12,197,176,0.08)] text-[#0CC5B0]"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/8"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
