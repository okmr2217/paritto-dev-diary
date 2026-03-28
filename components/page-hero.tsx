import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
}

export function PageHero({ title, description, icon: Icon, children }: PageHeroProps) {
  return (
    <section className="relative pt-6">
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg tech-gradient text-white shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          ) : (
            <div className="h-1 w-24 tech-gradient rounded-full" />
          )}
          <h1 className="text-3xl md:text-4xl font-bold font-heading tech-gradient-text translate-y-0.5">
            {title}
          </h1>
        </div>
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
