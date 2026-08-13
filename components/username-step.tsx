"use client";

import { SiGithub } from "react-icons/si";
import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { GithubUserStatus } from "@/hooks/use-github-user";
import type { Dictionary } from "@/lib/i18n";

type UsernameStepProps = {
  t: Dictionary;
  value: string;
  onChange: (value: string) => void;
  status: GithubUserStatus;
  avatarUrl: string | null;
};

export function UsernameStep({
  t,
  value,
  onChange,
  status,
  avatarUrl,
}: UsernameStepProps) {
  const w = t.wizard;
  const rateLimited = status === "rate-limited";

  return (
    <div className="space-y-3">
      <InputGroup className="h-10">
        <InputGroupAddon>
          <SiGithub className="text-muted-foreground" />
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder={w.usernamePlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          aria-invalid={status === "invalid"}
          autoComplete="off"
          spellCheck={false}
        />
        <InputGroupAddon align="inline-end">
          {status === "checking" && <Spinner />}
          {status === "valid" &&
            (avatarUrl ? (
              <Avatar size="sm">
                <AvatarImage src={avatarUrl} alt={value} />
                <AvatarFallback>
                  {value.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <CheckCircle2 className="text-emerald-500" />
            ))}
          {status === "invalid" && <XCircle className="text-destructive" />}
          {rateLimited && <TriangleAlert className="text-muted-foreground" />}
        </InputGroupAddon>
      </InputGroup>

      {status === "invalid" && (
        <Alert variant="destructive">
          <XCircle />
          <AlertDescription>{w.usernameNotFound}</AlertDescription>
        </Alert>
      )}

      {/* Not the user's fault and not their username's fault, so this is a
          warning rather than an error — the name may well be perfectly valid. */}
      {rateLimited && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertDescription>{w.usernameRateLimited}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
