"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { TriangleAlert, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { StepShell } from "@/components/step-shell";
import { URL_TOKEN, type InstructionStep } from "@/lib/instructions";

type InstructionStepViewProps = {
  step: InstructionStep;
  imageUrl: string;
  isLast?: boolean;
};

function UrlLine({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
        {url}
      </code>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? <Check className="text-emerald-500" /> : <Copy />}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}

function renderLine(line: ReactNode, imageUrl: string, key: number) {
  if (typeof line === "string" && line === URL_TOKEN) {
    return <UrlLine key={key} url={imageUrl} />;
  }
  return (
    <p key={key} className="text-sm text-muted-foreground">
      {line}
    </p>
  );
}

export function InstructionStepView({
  step,
  imageUrl,
  isLast,
}: InstructionStepViewProps) {
  return (
    <StepShell number={step.number} title={step.title} isLast={isLast}>
      <div className="space-y-3">
        {step.paragraphs?.map((line, i) => renderLine(line, imageUrl, i))}
        {step.actions?.map((action) => (
          <div key={action.number} className="rounded-lg border border-border p-3">
            <p className="text-sm font-medium text-foreground">
              <span className="text-muted-foreground">{action.number}</span>{" "}
              {action.title}
            </p>
            <div className="mt-1.5 space-y-1.5">
              {action.details.map((line, i) => renderLine(line, imageUrl, i))}
            </div>
            {action.note && (
              <Alert variant="warning" className="mt-2">
                <TriangleAlert />
                <AlertDescription>{action.note}</AlertDescription>
              </Alert>
            )}
          </div>
        ))}
      </div>
    </StepShell>
  );
}
