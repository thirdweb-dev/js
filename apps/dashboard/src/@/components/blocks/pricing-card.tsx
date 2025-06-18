"use client";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RenewSubscriptionButton } from "components/settings/Account/Billing/renew-subscription/renew-subscription-button";
import { CheckIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { remainingDays } from "utils/date-utils";
import { TEAM_PLANS } from "utils/pricing";
import type { ProductSKU } from "../../lib/billing";
import { CheckoutButton } from "../billing";

type PricingCardCta = {
  hint?: string;
  onClick?: () => void;
} & (
  | {
      type: "link";
      href: string;
      label: string;
    }
  | {
      type: "checkout";
      label: string;
    }
  | {
      type: "renew";
    }
);

type PricingCardProps = {
  getTeam: () => Promise<Team>;
  teamSlug: string;
  teamId: string;
  billingStatus: Team["billingStatus"];
  billingPlan: keyof typeof TEAM_PLANS;
  cta?: PricingCardCta;
  ctaHint?: string;
  highlighted?: boolean;
  current?: boolean;
  activeTrialEndsAt?: string;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  getTeam,
  teamSlug,
  teamId,
  billingStatus,
  billingPlan,
  cta,
  highlighted = false,
  current = false,
  activeTrialEndsAt,
}) => {
  const plan = TEAM_PLANS[billingPlan];

  const remainingTrialDays =
    (activeTrialEndsAt ? remainingDays(activeTrialEndsAt) : 0) || 0;

  // if the team has just signed up and has not subscribed yet, and the billing plan is growth, then they get a 7 day trial
  const has7DayTrial =
    remainingTrialDays === 0 &&
    billingStatus === "noPayment" &&
    billingPlan === "growth";

  return (
    <div
      className={cn(
        "z-10 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4",
        current && "border-blue-500",
        highlighted && "border-active-border",
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
          <div className="mb-1 flex flex-row items-center gap-3">
            <h3 className="font-semibold text-2xl capitalize tracking-tight">
              {plan.title}
            </h3>
            {current && <Badge className="capitalize">Current plan</Badge>}
            {has7DayTrial && <Badge variant="success">7 Day Free Trial</Badge>}
          </div>
          <p className="max-w-[320px] text-muted-foreground text-sm">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          {plan.isStartingPriceOnly && (
            <span className="text-muted-foreground text-xs">Starting at</span>
          )}
          {has7DayTrial ? (
            <div className="flex flex-col items-start gap-0">
              <span className="font-bold text-2xl text-foreground tracking-tight">
                7 days free
              </span>
              <span className="text-muted-foreground text-sm">
                Then ${plan.price.toLocaleString()} / month
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-2xl text-foreground tracking-tight">
                ${plan.price.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/ month</span>
            </div>
          )}

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

      <div className="flex grow flex-col items-start gap-2 text-foreground">
        {plan.subTitle && (
          <p className="font-medium text-foreground text-sm">{plan.subTitle}</p>
        )}

        {plan.features.map((f) => (
          <FeatureItem key={Array.isArray(f) ? f[0] : f} text={f} />
        ))}
      </div>

      {cta && (
        <div className="flex flex-col gap-3">
          {cta.type === "renew" && (
            <RenewSubscriptionButton teamId={teamId} getTeam={getTeam} />
          )}
          {billingPlanToSkuMap[billingPlan] && cta.type === "checkout" && (
            <CheckoutButton
              billingStatus={billingStatus}
              buttonProps={{
                variant: highlighted ? "default" : "outline",
                className: highlighted ? undefined : "bg-background",
                onClick: cta.onClick,
              }}
              teamSlug={teamSlug}
              sku={billingPlanToSkuMap[billingPlan]}
            >
              {has7DayTrial ? "Start 7 Day Free Trial" : cta.label}
            </CheckoutButton>
          )}

          {cta.type === "link" && (
            <Button
              variant={highlighted ? "default" : "outline"}
              className={highlighted ? undefined : "bg-background"}
              asChild
            >
              <Link
                href={cta.href}
                target="_blank"
                onClick={cta.onClick}
                rel="noopener noreferrer"
              >
                {has7DayTrial ? "Start 7 Day Free Trial" : cta.label}
              </Link>
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

const billingPlanToSkuMap: Record<Team["billingPlan"], ProductSKU | undefined> =
  {
    starter: "plan:starter",
    growth: "plan:growth",
    scale: "plan:scale",
    pro: "plan:pro",
    // we can't render checkout buttons for these plans:
    accelerate: undefined,
    free: undefined,
    growth_legacy: undefined,
  };

type FeatureItemProps = {
  text: string | string[];
};

function FeatureItem({ text }: FeatureItemProps) {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <div className="flex items-center gap-2 text-sm">
      {Array.isArray(text) ? (
        <ToolTipLabel label={text[1]}>
          <DollarSignIcon className="size-4 shrink-0 text-green-500" />
        </ToolTipLabel>
      ) : (
        <CheckIcon className="size-4 shrink-0 text-green-500" />
      )}
      {Array.isArray(text) ? (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            {titleStr}{" "}
            <span className="text-muted-foreground md:hidden">{text[1]}</span>
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">{titleStr}</p>
      )}
    </div>
  );
}
