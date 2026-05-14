"use client";
import React from "react";
import { PickerView } from "antd-mobile";

export type WheelerOption = {
  label: string;
  value: string;
};

interface WheelerPickerProps {
  options: WheelerOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
}

export const WheelerPicker = ({
  options,
  value,
  onChange,
  className,
}: WheelerPickerProps) => {
  const pickerValue =
    value !== undefined
      ? [
          typeof value === "number" && options[0]?.value.length === 2
            ? value.toString().padStart(2, "0")
            : value?.toString(),
        ]
      : undefined;

  return (
    <div className={className}>
      <PickerView
        style={{ height: "150px", width: "100px" }}
        columns={[options]}
        value={pickerValue}
        mouseWheel={true}
        onChange={(val) => {
          if (onChange && val[0]) {
            const result = val[0] as string;
            // If the incoming value is a number, or the result looks like a number, return a number
            const isNumeric =
              typeof value === "number" || !isNaN(Number(result));
            onChange(isNumeric ? Number(result) : result);
          }
        }}
      />
    </div>
  );
};
