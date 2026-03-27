import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={"/icons/android-icon-192x192.png"}
              alt="icon"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h1 className="hidden md:block text-lg font-bold tracking-tight font-heading transition-all duration-300 group-hover:tech-gradient-text">
            パリッと開発日記
          </h1>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/blog"
            className="relative text-sm font-medium font-heading transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:tech-gradient after:transition-all after:duration-300 hover:after:w-full"
          >
            ブログ
          </Link>
          <Link
            href="/about"
            className="relative text-sm font-medium font-heading transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:tech-gradient after:transition-all after:duration-300 hover:after:w-full"
          >
            自己紹介
          </Link>
          <Link
            href="/products"
            className="relative text-sm font-medium font-heading transition-colors hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:tech-gradient after:transition-all after:duration-300 hover:after:w-full"
          >
            プロダクト
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
