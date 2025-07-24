"use client";

import Link from "next/link";
import { reportPaymentCardClick } from "@/analytics/report";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FeatureCard(props: {
  title: string;
  description: string;
  icon: React.ReactNode;
  id: string;
  link: { href: string; label: string; target?: string };
}) {
  return (
    <Card className="p-4 flex flex-col items-start gap-4">
      <div className="text-muted-foreground rounded-full border bg-background size-12 flex items-center justify-center">
        {props.icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold">{props.title}</h3>
        <p className="text-muted-foreground text-sm">{props.description}</p>
      </div>
      <Button
        onClick={() => reportPaymentCardClick({ id: props.id })}
        size="sm"
        variant="default"
        className="h-8"
        asChild
      >
        <Link href={props.link.href} target={props.link.target}>
          {props.link.label}
        </Link>
      </Button>
    </Card>
  );
}
