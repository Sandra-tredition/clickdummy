import * as React from "react";
import { CaretSortIcon, CheckIcon, X } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Auswählen...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring",
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selected.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return (
            <Badge key={value} variant="secondary" className="m-1 gap-1 pr-0.5">
              {option?.label || value}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 px-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(value);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>

      <SelectPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <SelectPrimitive.Trigger className="hidden" />
        <SelectPrimitive.Content
          position="popper"
          className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-full"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  selected.includes(option.value) &&
                    "bg-accent text-accent-foreground",
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  {selected.includes(option.value) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </span>
                {option.label}
              </div>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  );
}
