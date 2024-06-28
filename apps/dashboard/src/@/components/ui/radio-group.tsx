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
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
        "cursor-pointer group flex items-center px-3 peer-hover:border-nonce py-4 space-x-3 space-y-0 border-2 rounded-md min-w-32 font-medium hover:border-foreground/25 transition-all data-[state=checked]:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-4 h-4 border-2 rounded-full transition-all group-data-[state=checked]:border-primary text-primary group-hover:border-foreground/25 aspect-square ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {/* Show on checked */}
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center transition-all rounded-full">
          <Circle className="w-2 h-2 text-current fill-current" />
        </RadioGroupPrimitive.Indicator>
        {/* Show on hover */}
        <div className="items-center justify-center hidden transition-all rounded-full text-foreground/25 group-hover:flex group-data-[state=checked]:hidden">
          <Circle className="w-2 h-2 text-current fill-current" />
        </div>
      </div>
      <Label className="cursor-pointer">{props.children}</Label>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItemButton.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem, RadioGroupItemButton };
