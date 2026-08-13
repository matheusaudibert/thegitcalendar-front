"use client";

import { CheckIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  BACKGROUND_OPTIONS,
  COLOR_OPTIONS,
  SHAPE_OPTIONS,
} from "@/lib/colors";
import type { Background, ColorName, Shape } from "@/lib/build-image-url";
import type { Dictionary } from "@/lib/i18n";

type CustomizationStepProps = {
  t: Dictionary;
  background: Background;
  color: ColorName;
  shape: Shape;
  onBackgroundChange: (value: Background) => void;
  onColorChange: (value: ColorName) => void;
  onShapeChange: (value: Shape) => void;
};

/** Swatches light enough that a white tick would disappear into them. */
const LIGHT_SWATCHES: ColorName[] = ["white", "yellow", "orange", "pink"];

export function CustomizationStep({
  t,
  background,
  color,
  shape,
  onBackgroundChange,
  onColorChange,
  onShapeChange,
}: CustomizationStepProps) {
  const w = t.wizard;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          {w.commitColor}
        </p>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
          {COLOR_OPTIONS.map((option) => {
            const selected = option.value === color;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onColorChange(option.value)}
                aria-label={w.colors[option.value]}
                aria-pressed={selected}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full ring-1 ring-border transition-transform hover:scale-105",
                  selected &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: option.swatch }}
              >
                {selected && (
                  <CheckIcon
                    className={cn(
                      "size-4",
                      LIGHT_SWATCHES.includes(option.value)
                        ? "text-black"
                        : "text-white"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          {w.commitShape}
        </p>
        <RadioGroup
          value={shape}
          onValueChange={(value) => onShapeChange(value as Shape)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {SHAPE_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`shape-${option.value}`}>
              <Field orientation="horizontal" className="gap-2">
                <RadioGroupItem
                  id={`shape-${option.value}`}
                  value={option.value}
                />
                <FieldContent className="flex-row items-center gap-2">
                  <span
                    className={cn(
                      "size-4 shrink-0 bg-foreground",
                      option.radiusClass
                    )}
                  />
                  <FieldTitle>{w.shapes[option.value]}</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          {w.backgroundColor}
        </p>
        <RadioGroup
          value={background}
          onValueChange={(value) => onBackgroundChange(value as Background)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {BACKGROUND_OPTIONS.map((option) => (
            <FieldLabel
              key={option.value}
              htmlFor={`background-${option.value}`}
            >
              <Field orientation="horizontal" className="gap-2">
                <RadioGroupItem
                  id={`background-${option.value}`}
                  value={option.value}
                />
                <FieldContent className="flex-row items-center gap-2">
                  <span
                    className="size-4 shrink-0 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: option.swatch }}
                  />
                  <FieldTitle>{w.backgrounds[option.value]}</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
