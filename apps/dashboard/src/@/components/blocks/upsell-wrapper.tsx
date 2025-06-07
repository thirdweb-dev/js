"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CrownIcon, LockIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { TeamPlanBadge } from "../../../app/(app)/components/TeamPlanBadge";
import type { Team } from "../../api/team";
import { Badge } from "../ui/badge";

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
    <div className={cn("relative flex-1", className)}>
      {/* Background content - blurred and non-interactive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none select-none opacity-60 blur-[1px]">
          {children}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/30 to-background" />

      {/* Upsell content */}
      <div className="relative z-10 flex items-center justify-center p-16">
        <Card className="w-full max-w-2xl border-2 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 bg-muted">
              <LockIcon className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <TeamPlanBadge
                plan="scale"
                teamSlug={teamSlug}
                postfix=" Feature"
              />
              <CardTitle className="font-bold text-2xl text-foreground md:text-3xl">
                Unlock {featureName}
              </CardTitle>
              <CardDescription className="mx-auto max-w-md text-base text-muted-foreground">
                {featureDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {benefits.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                  What you'll get:
                </h4>
                <div className="grid gap-2">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.description}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                        <SparklesIcon className="h-3 w-3 text-success-text" />
                      </div>
                      <span className="text-sm">{benefit.description}</span>
                      {benefit.status === "soon" && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button className="flex-1 py-3 font-semibold" size="lg" asChild>
                <Link
                  href={`/team/${teamSlug}/~/settings/billing?showPlans=true&highlight=${requiredPlan}`}
                >
                  <CrownIcon className="mr-2 h-4 w-4" />
                  Upgrade to{" "}
                  <span className="ml-1 capitalize">{requiredPlan}</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="md:flex-1" asChild>
                <Link
                  href={`/team/${teamSlug}/~/settings/billing?showPlans=true`}
                >
                  View All Plans
                </Link>
              </Button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-muted-foreground text-xs">
                You are currently on the{" "}
                <span className="font-medium capitalize">{currentPlan}</span>{" "}
                plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
