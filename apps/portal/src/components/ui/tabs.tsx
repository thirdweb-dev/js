"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    className={cn(
      "flex w-full items-center justify-start border-b overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      "mb-1 flex items-center whitespace-nowrap px-3 h-10 text-sm font-medium rounded-lg relative",
      "border-transparent border-b text-muted-foreground ring-offset-700 transition-all",
      "hover:text-foreground hover:bg-accent data-[state=active]:text-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=active]:before:opacity-100 before:absolute before:opacity-0 before:border-b before:left-0 before:right-0 before:bottom-[-5px] before:transition-opacity before:duration-300",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
