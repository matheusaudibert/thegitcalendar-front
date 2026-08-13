"use client";

import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

/**
 * `rate-limited` is kept apart from `invalid` on purpose: the API is called
 * unauthenticated from the browser (60 requests/hour/IP), and telling someone
 * their username does not exist when we simply could not ask is a lie.
 */
export type GithubUserStatus =
  | "idle"
  | "checking"
  | "valid"
  | "invalid"
  | "rate-limited";

export type GithubUserResult = {
  status: GithubUserStatus;
  avatarUrl: string | null;
};

type Resolved = {
  username: string;
  status: "valid" | "invalid" | "rate-limited";
  avatarUrl: string | null;
};

export function useGithubUser(rawUsername: string): GithubUserResult {
  const username = rawUsername.trim();
  const debouncedUsername = useDebouncedValue(username, 400);
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    if (!debouncedUsername) {
      abortRef.current = null;
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    fetch(`https://api.github.com/users/${encodeURIComponent(debouncedUsername)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          setResolved({ username: debouncedUsername, status: "invalid", avatarUrl: null });
          return;
        }
        const data = await res.json();
        setResolved({
          username: debouncedUsername,
          status: "valid",
          avatarUrl: data.avatar_url ?? null,
        });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResolved({ username: debouncedUsername, status: "invalid", avatarUrl: null });
      });

    return () => controller.abort();
  }, [debouncedUsername]);

  if (!debouncedUsername) {
    return { status: "idle", avatarUrl: null };
  }
  if (username !== debouncedUsername || !resolved || resolved.username !== debouncedUsername) {
    return { status: "checking", avatarUrl: null };
  }
  return { status: resolved.status, avatarUrl: resolved.avatarUrl };
}
