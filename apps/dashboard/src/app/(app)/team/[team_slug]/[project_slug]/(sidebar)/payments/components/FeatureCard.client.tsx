"use client";

import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { reportPaymentCardClick } from "@/analytics/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FeatureCard(props: {
  title: string;
  description: string;
  badge?: { label: string; variant?: "outline" | "success" | "default" };
  id: string;
  icon: React.FC<{ className?: string }>;
  color?: "green" | "violet";
  setupTime?: number;
  features?: string[];
  link: { href: string; label: string; target?: string };
}) {
  return (
    <Card className="p-6 flex flex-col items-start gap-6 text-muted-foreground w-full">
      <div className="flex-1 flex flex-col items-start gap-6 w-full">
        <div className="relative w-full">
          <div
            className={`${props.color === "green" ? "bg-green-700/25" : "bg-violet-700/25"} rounded-lg size-9 flex items-center justify-center`}
          >
            <props.icon
              className={`size-5 ${props.color === "green" ? "text-green-500" : "text-violet-500"}`}
            />
          </div>
          {props.badge && (
            <Badge
              variant={props.badge.variant}
              className="absolute top-0 right-0"
            >
              {props.badge.label}
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground">{props.title}</h3>
          <p className="text-muted-foreground text-sm font-medium">
            {props.description}
          </p>
        </div>
        {(props.setupTime || props.features) && (
          <div className="flex justify-center gap-4 text-xs flex-col">
            {props.setupTime && (
              <p className="flex gap-2 items-center">
                <ClockIcon className="size-3" />
                {props.setupTime} minute{props.setupTime > 1 && "s"} setup time
              </p>
            )}
            {props.features && (
              <ul>
                {props.features.map((feature) => (
                  <li key={feature} className="flex gap-2 items-center mb-1.5">
                    <span className="bg-violet-500 size-1.5 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <Button
        onClick={() => reportPaymentCardClick({ id: props.id })}
        size="sm"
        variant="outline"
        className="w-full gap-2 group text-foreground"
        asChild
      >
        <Link href={props.link.href} target={props.link.target}>
          {props.link.label}
          <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-all" />
        </Link>
      </Button>
    </Card>
  );
}
