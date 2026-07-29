import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StepShellProps = {
  number: number;
  title: string;
  description?: string;
  isLast?: boolean;
  children: ReactNode;
  className?: string;
};

export function StepShell({
  number,
  title,
  description,
  isLast = false,
  children,
  className,
}: StepShellProps) {
  return (
    <div
      className={cn(
        "relative flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {number}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-border" />}
      </div>
      <div className="min-w-0 flex-1 pb-8">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
