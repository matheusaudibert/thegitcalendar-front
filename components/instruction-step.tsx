"use client";

import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepShell } from "@/components/step-shell";
import { UrlLine } from "@/components/url-line";
import { URL_TOKEN, type InstructionStep } from "@/lib/instructions";
import type { Dictionary } from "@/lib/i18n";
import { renderRichText } from "@/lib/rich-text";

type InstructionStepViewProps = {
  t: Dictionary;
  step: InstructionStep;
  imageUrl: string;
  isLast?: boolean;
};

/**
 * The URL token has to be intercepted before `renderRichText` sees it —
 * otherwise the bare-URL branch would turn the wallpaper link into an ordinary
 * anchor instead of the copyable block.
 */
function renderLine(
  line: string,
  t: Dictionary,
  imageUrl: string,
  key: number
) {
  if (line === URL_TOKEN) {
    return <UrlLine key={key} t={t} url={imageUrl} />;
  }
  return (
    <p key={key} className="text-sm text-muted-foreground">
      {renderRichText(line)}
    </p>
  );
}

export function InstructionStepView({
  t,
  step,
  imageUrl,
  isLast,
}: InstructionStepViewProps) {
  return (
    <StepShell number={step.number} title={step.title} isLast={isLast}>
      <div className="space-y-3">
        {step.paragraphs?.map((line, i) => renderLine(line, t, imageUrl, i))}
        {step.actions?.map((action) => (
          <div
            key={action.number}
            className="rounded-lg border border-border p-3"
          >
            <p className="text-sm font-medium text-foreground">
              <span className="text-muted-foreground">{action.number}</span>{" "}
              {action.title}
            </p>
            <div className="mt-1.5 space-y-1.5">
              {action.details.map((line, i) => renderLine(line, t, imageUrl, i))}
            </div>
            {action.note && (
              <Alert variant="warning" className="mt-2">
                <TriangleAlert />
                {/* Bold inside a note keeps the alert's amber rather than the
                    white `renderRichText` gives it elsewhere. A descendant
                    selector outranks the class on the `<strong>` itself. */}
                <AlertDescription className="[&_strong]:text-current">
                  {renderRichText(action.note)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}
      </div>
    </StepShell>
  );
}
