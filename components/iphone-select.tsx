"use client";

import { Smartphone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { IPHONE_DEVICES, type Device } from "@/lib/devices";
import type { Dictionary } from "@/lib/i18n";

type IphoneSelectProps = {
  t: Dictionary;
  value: Device | null;
  onChange: (device: Device) => void;
};

export function IphoneSelect({ t, value, onChange }: IphoneSelectProps) {
  return (
    <Select
      // The panel is absolutely positioned inside the field, so it needs to
      // sit above the steps that follow it.
      className="z-30"
      value={value?.label ?? ""}
      onValueChange={(label) => {
        const device = IPHONE_DEVICES.find((d) => d.label === label);
        if (device) onChange(device);
      }}
    >
      <SelectTrigger className="h-11 bg-card">
        <span className="flex min-w-0 items-center gap-2">
          <Smartphone className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue
            placeholder={t.wizard.iphonePlaceholder}
            className="truncate"
          />
        </span>
      </SelectTrigger>
      <SelectContent className="bg-card">
        {IPHONE_DEVICES.map((device) => (
          <SelectItem key={device.label} value={device.label}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
