import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollShadow } from "./ScrollShadow/ScrollShadow";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    className={cn(
      "w-full caption-bottom border-collapse align-top text-sm lining-nums tabular-nums",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    className={cn("relative border-b bg-background", className)}
    ref={ref}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    className={cn("[&_tr:last-child]:border-0", className)}
    ref={ref}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    className={cn(
      "border-border border-t bg-card font-medium [&>tr]:last:border-b-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    /**
     * Contain the absolutely position elements inside the row with position:relative + transform:translate(0)
     * transform:translate(0) is required because position:relative on tr element does not work on webkit
     */
    linkBox?: boolean;
  }
>(({ className, linkBox, ...props }, ref) => (
  <tr
    className={cn(
      "border-border border-b last:border-0 data-[state=selected]:bg-muted",
      linkBox && "relative translate-x-0 translate-y-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={cn(
      "px-6 py-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={cn(
      "px-6 py-4 text-start align-middle text-sm [&:has([role=checkbox])]:pr-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    className={cn("py-4 text-muted-foreground text-sm", className)}
    ref={ref}
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
      className={cn(
        "relative whitespace-nowrap rounded-lg border border-border bg-card",
        props.className,
      )}
      disableTopShadow
      scrollableClassName={props.scrollableContainerClassName}
      shadowClassName="z-30"
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
