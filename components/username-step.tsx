"use client";

import { SiGithub } from "react-icons/si";
import { CheckCircle2, XCircle } from "lucide-react";
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

type UsernameStepProps = {
  value: string;
  onChange: (value: string) => void;
  status: GithubUserStatus;
  avatarUrl: string | null;
};

export function UsernameStep({
  value,
  onChange,
  status,
  avatarUrl,
}: UsernameStepProps) {
  return (
    <div className="space-y-3">
      <InputGroup className="h-10">
        <InputGroupAddon>
          <SiGithub className="text-muted-foreground" />
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="your-github-username"
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
                <AvatarFallback>{value.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <CheckCircle2 className="text-emerald-500" />
            ))}
          {status === "invalid" && <XCircle className="text-destructive" />}
        </InputGroupAddon>
      </InputGroup>
      {status === "invalid" && (
        <Alert variant="destructive">
          <XCircle />
          <AlertDescription>
            We couldn&apos;t find a GitHub user with that username. Double-check
            the spelling and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
