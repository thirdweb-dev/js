import { cn } from "@/lib/utils";
import type * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  outlineBorder?: {
    gradient: string;
    width: string;
  };
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  outlineBorder,
  ...props
}) => {
  const baseClasses = cn(
    "rounded-xl border border-border bg-card shadow-sm px-4 py-4",
    className,
  );

  if (outlineBorder) {
    return (
      <div
        className="relative overflow-hidden"
        style={{ padding: outlineBorder.width }}
      >
        <div
          className="absolute inset-0 -z-10"
          style={{ background: outlineBorder.gradient }}
        />
        <div className={baseClasses} {...props}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};
