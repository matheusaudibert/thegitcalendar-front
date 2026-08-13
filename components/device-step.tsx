"use client";

import { IphoneSelect } from "@/components/iphone-select";
import { AndroidCombobox } from "@/components/android-combobox";
import type { Device } from "@/lib/devices";
import type { Platform } from "@/hooks/use-wizard-state";
import type { Dictionary } from "@/lib/i18n";

type DeviceStepProps = {
  t: Dictionary;
  platform: Platform;
  value: Device | null;
  onChange: (device: Device) => void;
};

export function DeviceStep({ t, platform, value, onChange }: DeviceStepProps) {
  if (platform === "apple") {
    return <IphoneSelect t={t} value={value} onChange={onChange} />;
  }
  return <AndroidCombobox t={t} value={value} onChange={onChange} />;
}
