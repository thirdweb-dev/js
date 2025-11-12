"use client";

import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { reportPaymentCardClick } from "@/analytics/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type FeatureCardProps = {
  title: string;
  description: string | undefined;
  badge?: { label: string; variant?: "outline" | "success" | "default" };
  id: string;
  icon: React.FC<{ className?: string }>;
  setupTime?: number;
  features?: string[];
} & (
  | {
      action?: never;
      link: { href: string; label: string };
    }
  | {
      action: React.ReactNode;
      link?: never;
    }
);

export function FeatureCard(props: FeatureCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-6 rounded-xl">
      {/* body */}
      <div className="flex-1 flex flex-col">
        {/* icon and badge */}
        <div className="relative w-full mb-4">
          <div className="flex">
            <div className="border bg-background rounded-full p-2.5">
              <props.icon className="size-4 text-muted-foreground" />
            </div>
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

        {/* title and description */}
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg text-foreground">
            {props.title}
          </h3>
          {props.description && (
            <p className="text-muted-foreground text-sm font-medium text-pretty">
              {props.description}
            </p>
          )}
        </div>

        <div className="h-3" />

        <div className="space-y-3">
          {props.setupTime && (
            <p className="flex gap-1.5 items-center text-xs text-muted-foreground">
              <ClockIcon className="size-3" />
              {props.setupTime} minute{props.setupTime > 1 && "s"} setup time
            </p>
          )}

          {props.features && (
            <ul className="space-y-1.5">
              {props.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-2 items-center text-xs text-muted-foreground"
                >
                  <span className="bg-muted-foreground size-1 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* footer */}
      {props.link ? (
        <Button
          onClick={() => reportPaymentCardClick({ id: props.id })}
          variant="outline"
          className="w-full gap-2 group text-foreground bg-background rounded-lg"
          asChild
        >
          <Link
            href={props.link.href}
            target={props.link.href.startsWith("http") ? "_blank" : undefined}
          >
            {props.link.label}
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-all text-muted-foreground" />
          </Link>
        </Button>
      ) : (
        props.action
      )}
    </Card>
  );
}
