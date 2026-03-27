import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative pt-6">
      <div className="space-y-4 pb-6 border-b border-border">
        <div className="h-1 w-24 tech-gradient rounded-full" />
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold font-heading tech-gradient-text">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
