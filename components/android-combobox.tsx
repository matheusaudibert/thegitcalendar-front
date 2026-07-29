"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { Smartphone } from "lucide-react";
import { InputGroupAddon } from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
} from "@/components/ui/combobox";
import { ANDROID_DEVICES, type AndroidDevice, type Device } from "@/lib/devices";

type AndroidComboboxProps = {
  value: Device | null;
  onChange: (device: AndroidDevice) => void;
};

export function AndroidCombobox({ value, onChange }: AndroidComboboxProps) {
  const virtualizerRef = React.useRef<Virtualizer<HTMLDivElement, Element> | null>(null);

  return (
    <Combobox
      items={ANDROID_DEVICES}
      value={value as AndroidDevice | null}
      onValueChange={(device) => {
        if (device) onChange(device as AndroidDevice);
      }}
      itemToStringLabel={(device: AndroidDevice) => device.label}
      isItemEqualToValue={(a: AndroidDevice, b: AndroidDevice) =>
        a.label === b.label
      }
      virtualized
      onItemHighlighted={(item, { reason, index }) => {
        const virtualizer = virtualizerRef.current;
        if (!item || !virtualizer) return;
        const isStart = index === 0;
        const isEnd = index === virtualizer.options.count - 1;
        const shouldScroll =
          reason === "none" || (reason === "keyboard" && (isStart || isEnd));
        if (shouldScroll) {
          queueMicrotask(() => {
            virtualizer.scrollToIndex(index, { align: isEnd ? "start" : "end" });
          });
        }
      }}
    >
      <ComboboxInput placeholder="Search your Android device...">
        <InputGroupAddon align="inline-start">
          <Smartphone className="text-muted-foreground" />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No device found.</ComboboxEmpty>
        <ComboboxList className="max-h-none overflow-visible p-0">
          <VirtualizedDeviceList virtualizerRef={virtualizerRef} />
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function VirtualizedDeviceList({
  virtualizerRef,
}: {
  virtualizerRef: React.RefObject<Virtualizer<HTMLDivElement, Element> | null>;
}) {
  const filteredItems = ComboboxPrimitive.useFilteredItems<AndroidDevice>();
  const scrollElementRef = React.useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 36,
    overscan: 20,
    paddingStart: 4,
    paddingEnd: 4,
  });

  React.useImperativeHandle(virtualizerRef, () => virtualizer);

  const handleScrollElementRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      scrollElementRef.current = element;
      if (element) virtualizer.measure();
    },
    [virtualizer]
  );

  if (!filteredItems.length) return null;

  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      role="presentation"
      ref={handleScrollElementRef}
      className="max-h-72 overflow-y-auto p-1"
    >
      <div role="presentation" className="relative w-full" style={{ height: totalSize }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const device = filteredItems[virtualItem.index];
          if (!device) return null;
          return (
            <ComboboxItem
              key={virtualItem.key}
              index={virtualItem.index}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              value={device}
              aria-setsize={filteredItems.length}
              aria-posinset={virtualItem.index + 1}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <span className="text-muted-foreground">{device.brand}</span>
              <span className="truncate">{device.label}</span>
            </ComboboxItem>
          );
        })}
      </div>
    </div>
  );
}
