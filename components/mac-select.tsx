"use client";

import { Laptop } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAC_DEVICES, type Device } from "@/lib/devices";

type MacSelectProps = {
  value: Device | null;
  onChange: (device: Device) => void;
};

export function MacSelect({ value, onChange }: MacSelectProps) {
  return (
    <Select
      value={value?.label ?? null}
      onValueChange={(label) => {
        const device = MAC_DEVICES.find((d) => d.label === label);
        if (device) onChange(device);
      }}
    >
      <SelectTrigger className="w-full">
        <Laptop className="text-muted-foreground" />
        <SelectValue placeholder="Select your Mac / display model" />
      </SelectTrigger>
      <SelectContent>
        {MAC_DEVICES.map((device) => (
          <SelectItem key={device.label} value={device.label}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
