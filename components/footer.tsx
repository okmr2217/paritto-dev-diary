import Link from "next/link";
import { ProfileCard } from "./profile-card";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 max-w-2xl">
          <ProfileCard />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground font-mono">
              &copy; {new Date().getFullYear()} パリッと開発日記
            </p>
            <Link
              href="/philosophy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              設計思想
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 tech-gradient rounded-full" />
            <span className="text-xs text-muted-foreground font-heading">
              Made with Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
