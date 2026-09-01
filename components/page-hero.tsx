import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative pt-6">
      <div className="space-y-3 pb-6 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-bold font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
