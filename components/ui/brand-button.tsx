import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * The CTA treatment from animations.dev's `.buy-button`: a two-stop vertical
 * gradient, an inset white highlight, two hairline outer shadows, and a fourth
 * ring in the button's own hue — plus `brightness(105%)` on hover over a 200ms
 * filter transition. Theirs is yellow with black text; ours are Apple blue and
 * Android green, which are dark enough to need white text instead. Their 16px
 * radius is tightened to 10px here.
 */
const brandButtonVariants = cva(
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] px-4 text-base [font-weight:575] [text-shadow:0_1px_1.5px_#00000029] transition-[filter] duration-200 ease-out enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        apple:
          "text-white [background-image:linear-gradient(#2185F0_0%,#005FC7_100%)] shadow-[inset_0_0_1px_1px_#ffffff24,0_0_0_1px_#00000014,0_2px_2px_#0000000a,0_0_0_1px_#1A78E0]",
        android:
          "text-white [background-image:linear-gradient(#1FA35F_0%,#0E6B37_100%)] shadow-[inset_0_0_1px_1px_#ffffff24,0_0_0_1px_#00000014,0_2px_2px_#0000000a,0_0_0_1px_#188C50]",
        // Sand-scale version for the not-yet-available Desktop action.
        neutral:
          "text-muted-foreground [background-image:linear-gradient(#31312e_0%,#222221_100%)] shadow-[inset_0_0_1px_1px_#ffffff0f,0_0_0_1px_#00000014,0_2px_2px_#0000000a,0_0_0_1px_#3b3a37]",
      },
    },
    defaultVariants: {
      variant: "apple",
    },
  }
);

export type BrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof brandButtonVariants>;

export function BrandButton({
  variant,
  className,
  ...props
}: BrandButtonProps) {
  return (
    <button
      type="button"
      className={cn(brandButtonVariants({ variant }), className)}
      {...props}
    />
  );
}
