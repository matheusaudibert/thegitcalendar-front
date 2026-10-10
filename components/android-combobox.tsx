"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/motion/combobox";
import { ANDROID_DEVICES, type AndroidDevice, type Device } from "@/lib/devices";
import type { Dictionary } from "@/lib/i18n";

type AndroidComboboxProps = {
  t: Dictionary;
  value: Device | null;
  onChange: (device: AndroidDevice) => void;
};

/**
 * beUI's combobox mounts every option it is given, and there are hundreds of
 * Android devices. The query is held here instead and only the first matches
 * are rendered — anyone looking for a specific phone types its name anyway.
 */
const MAX_RESULTS = 60;

const BY_LABEL = new Map(ANDROID_DEVICES.map((device) => [device.label, device]));

/** The filtering already happened above; the combobox should not redo it. */
const passThrough = () => true;

export function AndroidCombobox({ t, value, onChange }: AndroidComboboxProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (needle) {
      return ANDROID_DEVICES.filter((device) =>
        `${device.brand} ${device.label}`.toLocaleLowerCase().includes(needle)
      ).slice(0, MAX_RESULTS);
    }

    // With no query the field is either closed or just opened. Closed, the
    // input reads its text from the selected option, so that option has to be
    // among the mounted ones even when it sits past the first page.
    const firstPage = ANDROID_DEVICES.slice(0, MAX_RESULTS);
    const selected = value ? BY_LABEL.get(value.label) : undefined;
    return selected && !firstPage.includes(selected)
      ? [...firstPage, selected]
      : firstPage;
  }, [query, value]);

  return (
    <Combobox
      value={value?.label}
      onValueChange={(label) => {
        const device = BY_LABEL.get(label);
        if (device) onChange(device);
      }}
      query={query}
      onQueryChange={setQuery}
      filter={passThrough}
    >
      <ComboboxTrigger className="h-11 bg-card">
        <ComboboxInput
          placeholder={t.wizard.androidPlaceholder}
          aria-label={t.wizard.androidPlaceholder}
        />
      </ComboboxTrigger>
      <ComboboxContent className="bg-card">
        <ComboboxList className="max-h-72">
          {results.map((device) => (
            <ComboboxItem
              key={device.label}
              value={device.label}
              textValue={device.label}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-muted-foreground">
                  {device.brand}
                </span>
                <span className="truncate text-foreground">{device.label}</span>
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>{t.wizard.deviceEmpty}</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}
