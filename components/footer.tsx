export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto flex h-16 max-w-176 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} パリッと開発日記. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
