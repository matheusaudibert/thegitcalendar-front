import { LockScreenClock } from "@/components/lock-screen-clock";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type PhoneMockupProps = {
  imageUrl: string;
  alt: string;
  locale: Locale;
  className?: string;
};

/**
 * iPhone frame drawn entirely in CSS. Every dimension is a multiple of `--u`,
 * so the whole device scales by changing that single custom property. The
 * `min(..., vh)` cap keeps the phone from outgrowing short viewports.
 */
export function PhoneMockup({
  imageUrl,
  alt,
  locale,
  className,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative aspect-[180/380] w-[calc(180*var(--u))] shrink-0",
        "[--u:min(1.35px,0.19vh)] sm:[--u:min(1.55px,0.19vh)] md:[--u:min(1.6px,0.19vh)] lg:[--u:min(1.95px,0.19vh)]",
        className
      )}
    >
      <div className="absolute inset-0 rounded-[calc(36*var(--u))] bg-gradient-to-b from-[#3A3A3C] via-[#1C1C1E] to-[#3A3A3C] shadow-2xl">
        <div className="absolute inset-[calc(3*var(--u))] rounded-[calc(33*var(--u))] bg-[#1C1C1E]">
          <div className="absolute inset-[calc(3*var(--u))] overflow-hidden rounded-[calc(30*var(--u))] bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt}
              className="h-full w-full object-cover"
            />
            <LockScreenClock locale={locale} />
          </div>
        </div>
      </div>
      <div className="absolute top-[calc(72*var(--u))] left-[calc(-2*var(--u))] h-[calc(18*var(--u))] w-[calc(3*var(--u))] rounded-l-sm bg-[#3A3A3C]" />
      <div className="absolute top-[calc(100*var(--u))] left-[calc(-2*var(--u))] h-[calc(32*var(--u))] w-[calc(3*var(--u))] rounded-l-sm bg-[#3A3A3C]" />
      <div className="absolute top-[calc(140*var(--u))] left-[calc(-2*var(--u))] h-[calc(32*var(--u))] w-[calc(3*var(--u))] rounded-l-sm bg-[#3A3A3C]" />
      <div className="absolute top-[calc(110*var(--u))] right-[calc(-2*var(--u))] h-[calc(48*var(--u))] w-[calc(3*var(--u))] rounded-r-sm bg-[#3A3A3C]" />
    </div>
  );
}
