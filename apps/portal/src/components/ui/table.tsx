import * as React from "react";

import { cn } from "@/lib/utils"; // Adjusted path for portal
import { ScrollShadow } from "./ScrollShadow/ScrollShadow"; // Path within portal/components/ui

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      "w-full caption-bottom border-collapse align-top text-sm lining-nums tabular-nums",
      className,
    )}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("relative border-b bg-background", className)}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-border border-t bg-card font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    linkBox?: boolean;
  }
>(({ className, linkBox, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-border border-b last:border-0 data-[state=selected]:bg-muted",
      linkBox && "relative translate-x-0 translate-y-0",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-6 py-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-6 py-4 text-start align-middle text-sm [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("py-4 text-muted-foreground text-sm", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

function TableContainer(props: {
  children: React.ReactNode;
  className?: string;
  scrollableContainerClassName?: string;
}) {
  return (
    <ScrollShadow
      shadowClassName="z-30"
      disableTopShadow
      className={cn(
        "relative whitespace-nowrap rounded-lg border border-border bg-card",
        props.className,
      )}
      scrollableClassName={props.scrollableContainerClassName}
      shadowColor="hsl(var(--muted))"
    >
      {props.children}
    </ScrollShadow>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableContainer,
};
