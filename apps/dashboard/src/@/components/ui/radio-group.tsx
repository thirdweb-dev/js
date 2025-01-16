"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-inverted text-inverted ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Displays the radio item as a button-like element
const RadioGroupItemButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group flex min-w-32 cursor-pointer items-center space-x-3 space-y-0 rounded-lg border px-4 py-3 font-medium transition-all hover:border-foreground/25 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-hover:border-nonce data-[state=checked]:border-muted-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex aspect-square h-4 w-4 items-center justify-center rounded-full border text-inverted ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-foreground/25 group-data-[state=checked]:border-inverted">
        {/* Show on checked */}
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center rounded-full transition-all">
          <Circle className="h-2 w-2 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
        {/* Show on hover */}
        <div className="hidden items-center justify-center rounded-full text-foreground/25 transition-all group-hover:flex group-data-[state=checked]:hidden">
          <Circle className="h-2 w-2 fill-current text-current" />
        </div>
      </div>
      <Label className="cursor-pointer">{props.children}</Label>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItemButton.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem, RadioGroupItemButton };
