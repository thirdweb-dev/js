"use client";
import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckIcon, CircleDollarSignIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { TEAM_PLANS } from "utils/pricing";
import { useTrack } from "../../../hooks/analytics/useTrack";
import { remainingDays } from "../../../utils/date-utils";
import type { GetBillingCheckoutUrlAction } from "../../actions/billing";
import type { ProductSKU } from "../../lib/billing";
import { CheckoutButton } from "../billing";

type PricingCardCta = {
  hint?: string;
  title: string;
  onClick?: () => void;
} & (
  | {
      type: "link";
      href: string;
    }
  | {
      type: "checkout";
    }
);

type PricingCardProps = {
  teamSlug: string;
  billingStatus: Team["billingStatus"];
  billingPlan: keyof typeof TEAM_PLANS;
  cta?: PricingCardCta;
  ctaHint?: string;
  highlighted?: boolean;
  current?: boolean;
  activeTrialEndsAt?: string;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  teamSlug,
  billingStatus,
  billingPlan,
  cta,
  highlighted = false,
  current = false,
  activeTrialEndsAt,
  getBillingCheckoutUrl,
}) => {
  const plan = TEAM_PLANS[billingPlan];
  const isCustomPrice = typeof plan.price === "string";

  const trackEvent = useTrack();
  const remainingTrialDays =
    (activeTrialEndsAt ? remainingDays(activeTrialEndsAt) : 0) || 0;

  const handleCTAClick = () => {
    cta?.onClick?.();
    trackEvent({
      category: "account",
      label: `${billingPlan}Plan`,
      action: "click",
    });
  };

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
          </div>
          <p className="max-w-[320px] text-muted-foreground text-sm">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-2xl text-foreground tracking-tight">
              ${plan.price}
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
          {billingPlanToSkuMap[billingPlan] && cta.type === "checkout" && (
            <CheckoutButton
              billingStatus={billingStatus}
              buttonProps={{
                variant: highlighted ? "default" : "outline",
                className: highlighted ? undefined : "bg-background",
                onClick: handleCTAClick,
              }}
              teamSlug={teamSlug}
              sku={billingPlanToSkuMap[billingPlan]}
              getBillingCheckoutUrl={getBillingCheckoutUrl}
            >
              {cta.title}
            </CheckoutButton>
          )}

          {cta.type === "link" && (
            <Button
              variant={highlighted ? "default" : "outline"}
              className={highlighted ? undefined : "bg-background"}
              asChild
            >
              <Link href={cta.href} target="_blank" onClick={handleCTAClick}>
                {cta.title}
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
    accelerate: "plan:accelerate",
    scale: "plan:scale",
    // we can't render checkout buttons for these plans:
    pro: undefined,
    free: undefined,
    growth_legacy: undefined,
    starter_legacy: undefined,
  };

type FeatureItemProps = {
  text: string | string[];
};

function FeatureItem({ text }: FeatureItemProps) {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckIcon className="size-4 shrink-0 text-green-500" />
      {Array.isArray(text) ? (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            {titleStr}{" "}
            <span className="text-muted-foreground md:hidden">{text[1]}</span>
          </p>
          <ToolTipLabel label={text[1]}>
            <CircleDollarSignIcon className="hidden size-4 text-muted-foreground md:block" />
          </ToolTipLabel>
        </div>
      ) : (
        <p className="text-muted-foreground">{titleStr}</p>
      )}
    </div>
  );
}
