import Link from "next/link";

const footerLinks = [
  { href: "/releases", label: "Releases" },
  { href: "/about", label: "About" },
  { href: "/philosophy", label: "Philosophy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} paritto.dev
          </p>
          <nav className="flex items-center gap-5">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
