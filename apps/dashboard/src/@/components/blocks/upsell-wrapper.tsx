"use client";

import { CrownIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import type { Team } from "@/api/team/get-team";
import { TeamPlanBadge } from "@/components/blocks/TeamPlanBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UpsellWrapperProps {
  teamSlug: string;
  children: React.ReactNode;
  isLocked?: boolean;
  requiredPlan: Team["billingPlan"];
  currentPlan?: Team["billingPlan"];
  featureName: string;
  featureDescription: string;
  benefits?: {
    description: string;
    status: "available" | "soon";
  }[];
  className?: string;
}

export function UpsellWrapper({
  teamSlug,
  children,
  isLocked = true,
  requiredPlan,
  currentPlan = "free",
  featureName,
  featureDescription,
  benefits = [],
  className,
}: UpsellWrapperProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative flex-1 flex flex-col", className)}>
      {/* Background content - blurred and non-interactive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none select-none opacity-60 blur-[1px]">
          {children}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/30 to-background" />

      {/* Upsell content */}
      <div className="relative z-10 flex items-center justify-center grow py-20 px-6">
        <UpsellContent
          benefits={benefits}
          currentPlan={currentPlan}
          featureDescription={featureDescription}
          featureName={featureName}
          requiredPlan={requiredPlan}
          teamSlug={teamSlug}
        />
      </div>
    </div>
  );
}

export function UpsellContent(props: {
  teamSlug: string;
  featureName: string;
  featureDescription: string;
  requiredPlan: Team["billingPlan"];
  currentPlan: Team["billingPlan"];
  benefits?: {
    description: string;
    status: "available" | "soon";
  }[];
}) {
  return (
    <Card className="w-full max-w-xl border shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex p-4 items-center justify-center rounded-full border bg-card">
          <LockIcon className="size-8 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <TeamPlanBadge
            plan={props.requiredPlan}
            postfix=" Feature"
            teamSlug={props.teamSlug}
          />
          <div className="space-y-1">
            <CardTitle className="font-bold text-2xl text-foreground md:text-3xl">
              Unlock {props.featureName}
            </CardTitle>
            <CardDescription className="mx-auto max-w-md text-base text-muted-foreground">
              {props.featureDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {props.benefits && props.benefits.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm capitalize text-center">
              What you'll get
            </h4>
            <div className="grid gap-1.5">
              {props.benefits.map((benefit) => (
                <div
                  className="flex items-center justify-center gap-3 text-center text-balance"
                  key={benefit.description}
                >
                  <span className="text-sm">{benefit.description}</span>
                  {benefit.status === "soon" && (
                    <Badge className="text-xs" variant="secondary">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button asChild className="flex-1 py-3 font-semibold" size="lg">
            <Link
              href={`/team/${props.teamSlug}/~/billing?showPlans=true&highlight=${props.requiredPlan}`}
            >
              <CrownIcon className="mr-2 h-4 w-4" />
              Upgrade to{" "}
              <span className="ml-1 capitalize">{props.requiredPlan}</span>
            </Link>
          </Button>
          <Button asChild className="md:flex-1" size="lg" variant="outline">
            <Link href={`/team/${props.teamSlug}/~/billing?showPlans=true`}>
              View All Plans
            </Link>
          </Button>
        </div>

        <div className="pt-2 text-center">
          <p className="text-muted-foreground text-xs">
            You are currently on the{" "}
            <span className="font-medium capitalize">{props.currentPlan}</span>{" "}
            plan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
