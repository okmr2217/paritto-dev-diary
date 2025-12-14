import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Daichi Blog 2
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
