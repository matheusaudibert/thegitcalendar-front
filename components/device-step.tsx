"use client";

import { IphoneSelect } from "@/components/iphone-select";
import { AndroidCombobox } from "@/components/android-combobox";
import { MacSelect } from "@/components/mac-select";
import type { Device } from "@/lib/devices";
import type { Platform } from "@/hooks/use-wizard-state";

type DeviceStepProps = {
  platform: Platform;
  value: Device | null;
  onChange: (device: Device) => void;
};

export function DeviceStep({ platform, value, onChange }: DeviceStepProps) {
  if (platform === "apple") {
    return <IphoneSelect value={value} onChange={onChange} />;
  }
  if (platform === "mac") {
    return <MacSelect value={value} onChange={onChange} />;
  }
  return <AndroidCombobox value={value} onChange={onChange} />;
}
