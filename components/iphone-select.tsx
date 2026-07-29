"use client";

import { Smartphone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPHONE_DEVICES, type Device } from "@/lib/devices";

type IphoneSelectProps = {
  value: Device | null;
  onChange: (device: Device) => void;
};

export function IphoneSelect({ value, onChange }: IphoneSelectProps) {
  return (
    <Select
      value={value?.label ?? null}
      onValueChange={(label) => {
        const device = IPHONE_DEVICES.find((d) => d.label === label);
        if (device) onChange(device);
      }}
    >
      <SelectTrigger className="w-full">
        <Smartphone className="text-muted-foreground" />
        <SelectValue placeholder="Select your iPhone model" />
      </SelectTrigger>
      <SelectContent>
        {IPHONE_DEVICES.map((device) => (
          <SelectItem key={device.label} value={device.label}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
