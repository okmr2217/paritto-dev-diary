export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto flex h-16 max-w-3xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
