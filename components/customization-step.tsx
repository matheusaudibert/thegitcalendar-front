"use client";

import type { ReactNode } from "react";
import {
  ColorSelector,
  ColorSelectorItem,
  ColorSelectorLabel,
  ColorSelectorList,
} from "@/components/motion/color-selector";
import { BrazilFlag, UsFlag } from "@/components/flags";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";
import { cn } from "@/lib/utils";
import {
  BACKGROUND_OPTIONS,
  COLOR_OPTIONS,
  SHAPE_OPTIONS,
} from "@/lib/colors";
import type {
  Background,
  ColorName,
  Language,
  Shape,
} from "@/lib/build-image-url";
import type { Dictionary } from "@/lib/i18n";

type CustomizationStepProps = {
  t: Dictionary;
  background: Background;
  color: ColorName;
  shape: Shape;
  language: Language;
  onBackgroundChange: (value: Background) => void;
  onColorChange: (value: ColorName) => void;
  onShapeChange: (value: Shape) => void;
  onLanguageChange: (value: Language) => void;
};

const LANGUAGE_OPTIONS = [
  { value: "en", Flag: UsFlag },
  { value: "pt", Flag: BrazilFlag },
] as const satisfies readonly { value: Language; Flag: unknown }[];

/**
 * One bordered card per option. beUI's radio renders its own `<label>`, so
 * the preview sits in a sibling label pointed at the same control rather than
 * inside it — clicking anywhere on the card still selects it.
 */
function OptionCard({
  id,
  value,
  selected,
  children,
}: {
  id: string;
  value: string;
  selected: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors",
        selected ? "border-primary/60" : "border-border hover:border-border-strong"
      )}
    >
      <RadioGroupItem id={id} value={value} />
      <label
        htmlFor={id}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm text-foreground select-none"
      >
        {children}
      </label>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-sm font-medium text-foreground">{children}</p>;
}

export function CustomizationStep({
  t,
  background,
  color,
  shape,
  language,
  onBackgroundChange,
  onColorChange,
  onShapeChange,
  onLanguageChange,
}: CustomizationStepProps) {
  const w = t.wizard;
  // The shape previews are drawn in the commit colour picked above, so the
  // two choices read as one preview of the wallpaper's squares.
  const commitSwatch =
    COLOR_OPTIONS.find((option) => option.value === color)?.swatch;

  return (
    <div className="space-y-6">
      <ColorSelector
        value={color}
        onValueChange={(value) => onColorChange(value as ColorName)}
      >
        <ColorSelectorLabel className="mb-2 text-foreground">
          {w.commitColor}
        </ColorSelectorLabel>
        <ColorSelectorList className="gap-2.5">
          {COLOR_OPTIONS.map((option) => (
            <ColorSelectorItem
              key={option.value}
              value={option.value}
              color={option.swatch}
              label={w.colors[option.value]}
              className="size-10"
            />
          ))}
        </ColorSelectorList>
      </ColorSelector>

      <div>
        <SectionLabel>{w.commitShape}</SectionLabel>
        <RadioGroup
          value={shape}
          onValueChange={(value) => onShapeChange(value as Shape)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {SHAPE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              id={`shape-${option.value}`}
              value={option.value}
              selected={option.value === shape}
            >
              {/* The ring keeps white and black visible on either theme's
                  card, the same way the background swatches below do. */}
              <span
                className={cn(
                  "size-4 shrink-0 ring-1 ring-border-strong transition-colors duration-200",
                  option.radiusClass
                )}
                style={{ backgroundColor: commitSwatch }}
              />
              {w.shapes[option.value]}
            </OptionCard>
          ))}
        </RadioGroup>
      </div>

      <div>
        <SectionLabel>{w.backgroundColor}</SectionLabel>
        <RadioGroup
          value={background}
          onValueChange={(value) => onBackgroundChange(value as Background)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {BACKGROUND_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              id={`background-${option.value}`}
              value={option.value}
              selected={option.value === background}
            >
              <span
                className="size-4 shrink-0 rounded-full ring-1 ring-border-strong"
                style={{ backgroundColor: option.swatch }}
              />
              {w.backgrounds[option.value]}
            </OptionCard>
          ))}
        </RadioGroup>
      </div>

      <div>
        <SectionLabel>{w.language}</SectionLabel>
        <RadioGroup
          value={language}
          onValueChange={(value) => onLanguageChange(value as Language)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {LANGUAGE_OPTIONS.map(({ value, Flag }) => (
            <OptionCard
              key={value}
              id={`language-${value}`}
              value={value}
              selected={value === language}
            >
              <Flag className="h-3.5 w-5 shrink-0 rounded-[2px]" />
              {w.languages[value]}
            </OptionCard>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
