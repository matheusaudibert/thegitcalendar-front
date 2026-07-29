"use client";

import type { ComponentType } from "react";
import { FaApple } from "react-icons/fa6";
import { SiAndroid } from "react-icons/si";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Platform } from "@/hooks/use-wizard-state";

type PlatformStepProps = {
  value: Platform | null;
  onChange: (value: Platform) => void;
};

const PLATFORMS: {
  value: Platform;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    value: "apple",
    label: "Apple",
    description: "iOS Shortcuts automation",
    icon: FaApple,
  },
  {
    value: "android",
    label: "Android",
    description: "MacroDroid automation",
    icon: SiAndroid,
  },
];

export function PlatformStep({ value, onChange }: PlatformStepProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        const selected = value === platform.value;
        return (
          <Card
            key={platform.value}
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => onChange(platform.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(platform.value);
              }
            }}
            className={cn(
              "cursor-pointer items-center gap-1 px-4 py-5 text-center transition-colors hover:bg-accent/50",
              selected && "bg-accent/40 ring-2 ring-primary"
            )}
          >
            <Icon className="mx-auto size-7" />
            <p className="mt-2 text-sm font-medium">{platform.label}</p>
            <p className="text-xs text-muted-foreground">
              {platform.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
