import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
}

function SimpleSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  triggerClassName,
}: Props) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger size="default" className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectScrollUpButton />
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SimpleSelect;
