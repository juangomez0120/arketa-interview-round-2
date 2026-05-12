import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-start justify-between gap-6 mb-8", className)}>
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
