import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Blog
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
