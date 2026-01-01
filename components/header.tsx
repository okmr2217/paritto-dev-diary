import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto flex h-14 max-w-172 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={"/icons/android-icon-192x192.png"}
            alt="icon"
            width={36}
            height={36}
          />
          <h1 className="text-lg font-logo">
            パリッと開発日記
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
