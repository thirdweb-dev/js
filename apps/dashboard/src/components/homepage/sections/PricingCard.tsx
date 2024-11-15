import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import type React from "react";
import { TEAM_PLANS } from "utils/pricing";
import { CheckoutButton } from "../../../@/components/billing";
import { remainingDays } from "../../../utils/date-utils";
import { FeatureItem } from "./FeatureItem";

type ButtonProps = React.ComponentProps<typeof Button>;

type PricingCardProps = {
  team?: Team;
  billingPlan: Exclude<Team["billingPlan"], "free">;
  cta?: {
    hint?: string;
    title: string;
    href: string;
    target?: "_blank";
    tracking: {
      category: string;
      label?: string;
    };
    variant?: ButtonProps["variant"];
  };
  ctaHint?: string;
  highlighted?: boolean;
  current?: boolean;
  canTrialGrowth?: boolean;
  activeTrialEndsAt?: string;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  team,
  billingPlan,
  cta,
  highlighted = false,
  current = false,
  canTrialGrowth = false,
  activeTrialEndsAt,
}) => {
  const plan = TEAM_PLANS[billingPlan];
  const isCustomPrice = typeof plan.price === "string";

  const remainingTrialDays =
    (activeTrialEndsAt ? remainingDays(activeTrialEndsAt) : 0) || 0;

  return (
    <div
      className={cn(
        "z-[999] flex w-full flex-col gap-6 rounded-xl border border-border bg-muted/50 p-4 md:p-6",
        current && "border-blue-500",
      )}
      style={
        highlighted
          ? {
              backgroundImage:
                "linear-gradient(to top, hsl(var(--muted)) 30%, transparent)",
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-5">
        {/* Title + Desc */}
        <div>
          <div className="mb-2 flex flex-row items-center gap-2">
            <h3 className="font-semibold text-2xl capitalize tracking-tight">
              {plan.title}
            </h3>
            {current && <Badge className="capitalize">Current plan</Badge>}
          </div>
          <p className="max-w-[320px] text-muted-foreground">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-3xl text-foreground tracking-tight">
              {isCustomPrice ? (
                plan.price
              ) : canTrialGrowth ? (
                <>
                  <span className="text-muted-foreground line-through">
                    ${plan.price}
                  </span>{" "}
                  $0
                </>
              ) : (
                `$${plan.price}`
              )}
            </span>

            {!isCustomPrice && (
              <span className="text-muted-foreground">/ month</span>
            )}
          </div>

          {remainingTrialDays > 0 && (
            <p className="text-muted-foreground text-sm">
              Your free trial will{" "}
              {remainingTrialDays > 1
                ? `end in ${remainingTrialDays} days.`
                : "end today."}
            </p>
          )}
        </div>
      </div>

      <div className="flex grow flex-col items-start gap-2.5 text-foreground">
        {plan.subTitle && (
          <p className="font-medium text-foreground">{plan.subTitle}</p>
        )}

        {plan.features.map((f) => (
          <FeatureItem key={Array.isArray(f) ? f[0] : f} text={f} />
        ))}
      </div>

      {cta && (
        <div className="flex flex-col gap-3">
          {team && billingPlan !== "pro" ? (
            <CheckoutButton
              variant={cta.variant || "outline"}
              teamSlug={team.slug}
              sku={billingPlan === "starter" ? "plan:starter" : "plan:growth"}
            >
              {cta.title}
            </CheckoutButton>
          ) : (
            <Button variant={cta.variant || "outline"} asChild>
              <TrackedLinkTW
                href={cta.href}
                label={cta.tracking?.label}
                category={cta.tracking?.category}
                target={cta.target}
              >
                {cta.title}
              </TrackedLinkTW>
            </Button>
          )}

          {cta.hint && (
            <p className="text-center text-muted-foreground text-sm">
              {cta.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
