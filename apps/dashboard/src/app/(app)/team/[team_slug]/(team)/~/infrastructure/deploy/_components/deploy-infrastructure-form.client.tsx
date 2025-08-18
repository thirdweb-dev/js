"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { getChainInfraCheckoutURL } from "@/actions/billing";
import { reportChainInfraRpcOmissionAgreed } from "@/analytics/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { InsightIcon } from "@/icons/InsightIcon";
import { RPCIcon } from "@/icons/RPCIcon";
import { SmartAccountIcon } from "@/icons/SmartAccountIcon";
import { cn } from "@/lib/utils";
import type { ChainInfraSKU } from "@/types/billing";
import type { ChainMetadataWithServices } from "@/types/chain";
import { searchParams } from "../search-params";

// Pricing constants (USD)
const SERVICE_CONFIG = {
  accountAbstraction: {
    annualPrice: 6120,
    description:
      "Let developers offer gasless transactions and programmable smart accounts out-of-the-box. Powered by ERC-4337 & ERC-7702 for wallet-less onboarding and custom account logic.",
    icon: "SmartAccountIcon",
    label: "Account Abstraction",
    monthlyPrice: 600,
    required: false,
    sku: "chain:infra:account_abstraction" as const,
  },
  insight: {
    annualPrice: 15300,
    description:
      "Arm developers with real-time, indexed data via a turnkey REST API & Webhooks. Query any event, transaction, or token in milliseconds—no subgraph setup or indexer maintenance required.",
    icon: "InsightIcon",
    label: "Insight",
    monthlyPrice: 1500,
    required: false,
    sku: "chain:infra:insight" as const,
  },
  rpc: {
    annualPrice: 15300,
    description:
      "Deliver blazing-fast, reliable RPC endpoints through our global edge network so developers enjoy low-latency reads & writes that seamlessly scale with their traffic.",
    icon: "RPCIcon",
    label: "RPC",
    monthlyPrice: 1500,
    required: false,
    sku: "chain:infra:rpc" as const,
  },
} satisfies Record<
  string,
  {
    label: string;
    description: string;
    sku: ChainInfraSKU;
    monthlyPrice: number;
    annualPrice: number;
    required: boolean;
    icon: "RPCIcon" | "InsightIcon" | "SmartAccountIcon";
  }
>;

const formatUSD = (amount: number) => `$${amount.toLocaleString()}`;

export function DeployInfrastructureForm(props: {
  chain: ChainMetadataWithServices;
  teamSlug: string;
  isOwner: boolean;
  className?: string;
}) {
  const [isTransitionPending, startTransition] = useTransition();

  const [frequency, setFrequency] = useQueryState(
    "freq",
    searchParams.freq.withOptions({ history: "replace", startTransition }),
  );

  const [addonsStr, setAddonsStr] = useQueryState(
    "addons",
    searchParams.addons.withOptions({ history: "replace", startTransition }),
  );

  const [rpcParam, setRpcParam] = useQueryState(
    "rpc",
    searchParams.rpc.withOptions({ history: "replace", startTransition }),
  );

  const addons = useMemo(() => {
    return addonsStr ? addonsStr.split(",").filter(Boolean) : [];
  }, [addonsStr]);

  const includeInsight = addons.includes("insight");
  const includeAA = addons.includes("aa");
  const includeRPC = rpcParam === "on";

  const selectedOrder = useMemo(() => {
    const arr: (keyof typeof SERVICE_CONFIG)[] = [];
    if (includeRPC) arr.push("rpc");
    if (includeInsight) arr.push("insight");
    if (includeAA) arr.push("accountAbstraction");
    return arr;
  }, [includeInsight, includeAA, includeRPC]);

  // NEW: count selected services and prepare bundle discount hint
  const selectedCount = selectedOrder.length;

  const bundleHint = useMemo(() => {
    if (selectedCount === 1) {
      return "Add one more add-on to unlock a 10% bundle discount.";
    } else if (selectedCount === 2) {
      return "Add another add-on to increase your bundle discount to 15%.";
    } else if (selectedCount >= 3) {
      return "🎉 Congrats! You unlocked the maximum 15% bundle discount.";
    }
    return null;
  }, [selectedCount]);

  const selectedServices = useMemo(() => {
    return {
      accountAbstraction: includeAA,
      insight: includeInsight,
      rpc: includeRPC,
    } as const;
  }, [includeInsight, includeAA, includeRPC]);

  const pricePerService = useMemo(() => {
    const isAnnual = frequency === "annual";
    const mapping: Record<keyof typeof selectedServices, number> = {
      accountAbstraction:
        SERVICE_CONFIG.accountAbstraction[
          isAnnual ? "annualPrice" : "monthlyPrice"
        ],
      insight:
        SERVICE_CONFIG.insight[isAnnual ? "annualPrice" : "monthlyPrice"],
      rpc: SERVICE_CONFIG.rpc[isAnnual ? "annualPrice" : "monthlyPrice"],
    };
    return mapping;
  }, [frequency]);

  // Calculate totals and savings correctly
  const { subtotal, bundleDiscount, total, totalSavings, originalTotal } =
    useMemo(() => {
      let subtotal = 0; // price after annual discount but before bundle
      let originalTotal = 0; // monthly price * months (12 if annual) with no discounts
      let count = 0;
      (
        Object.keys(selectedServices) as Array<keyof typeof selectedServices>
      ).forEach((key) => {
        if (selectedServices[key]) {
          subtotal += pricePerService[key];
          originalTotal +=
            SERVICE_CONFIG[key].monthlyPrice *
            (frequency === "annual" ? 12 : 1);
          count += 1;
        }
      });

      let discountRate = 0;
      if (count === 2) {
        discountRate = 0.1;
      } else if (count >= 3) {
        discountRate = 0.15;
      }

      const annualDiscount =
        frequency === "annual" ? originalTotal - subtotal : 0;
      const bundleDiscount = subtotal * discountRate;
      const total = subtotal - bundleDiscount;
      const totalSavings = annualDiscount + bundleDiscount;
      return {
        annualDiscount,
        bundleDiscount,
        originalTotal,
        subtotal,
        total,
        totalSavings,
      };
    }, [selectedServices, pricePerService, frequency]);

  const chainId = props.chain.chainId;

  const [showRpcWarning, setShowRpcWarning] = useState(false);

  const proceedToCheckout = () => {
    startTransition(async () => {
      try {
        const skus: ChainInfraSKU[] = [];
        if (includeRPC) skus.push(SERVICE_CONFIG.rpc.sku);
        if (includeInsight) skus.push(SERVICE_CONFIG.insight.sku);
        if (includeAA) skus.push(SERVICE_CONFIG.accountAbstraction.sku);

        const res = await getChainInfraCheckoutURL({
          annual: frequency === "annual",
          chainId,
          skus,
          teamSlug: props.teamSlug,
        });

        if (res.status === "error") {
          toast.error(res.error);
        } else if (res.status === "success") {
          window.location.href = res.data;
        }
      } catch (err) {
        console.error(err);
        toast.error(
          "Failed to create checkout session. Please try again later.",
        );
      }
    });
  };

  const checkout = () => {
    const hasAddons = includeInsight || includeAA;
    if (!includeRPC && hasAddons) {
      setShowRpcWarning(true);
      return;
    }
    proceedToCheckout();
  };

  const periodLabel = frequency === "annual" ? "/yr" : "/mo";
  const isAnnual = frequency === "annual";

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left column: service selection + frequency */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Select Services</h3>

        {/* RPC (now optional) */}
        <div className="flex flex-col gap-2 mb-6">
          <ServiceCard
            description={SERVICE_CONFIG.rpc.description}
            icon={SERVICE_CONFIG.rpc.icon}
            label={SERVICE_CONFIG.rpc.label}
            onToggle={() => {
              const newVal = !includeRPC;
              setRpcParam(newVal ? "on" : "off");
            }}
            originalPrice={
              isAnnual ? SERVICE_CONFIG.rpc.monthlyPrice * 12 : undefined
            }
            periodLabel={periodLabel}
            price={pricePerService.rpc}
            selected={includeRPC}
          />
        </div>

        {/* Optional add-ons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Add-ons</p>
            {bundleHint && (
              <p className="text-xs font-medium text-primary">{bundleHint}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Insight */}
            <ServiceCard
              description={SERVICE_CONFIG.insight.description}
              icon={SERVICE_CONFIG.insight.icon}
              label={SERVICE_CONFIG.insight.label}
              onToggle={() => {
                const newVal = !includeInsight;
                const newAddons = addons.filter((a) => a !== "insight");
                if (newVal) newAddons.push("insight");
                setAddonsStr(newAddons.join(","));
              }}
              originalPrice={
                isAnnual ? SERVICE_CONFIG.insight.monthlyPrice * 12 : undefined
              }
              periodLabel={periodLabel}
              price={pricePerService.insight}
              selected={includeInsight}
            />

            {/* Account Abstraction */}
            <ServiceCard
              description={SERVICE_CONFIG.accountAbstraction.description}
              icon={SERVICE_CONFIG.accountAbstraction.icon}
              label={SERVICE_CONFIG.accountAbstraction.label}
              onToggle={() => {
                const newVal = !includeAA;
                const newAddons = addons.filter((a) => a !== "aa");
                if (newVal) newAddons.push("aa");
                setAddonsStr(newAddons.join(","));
              }}
              originalPrice={
                isAnnual
                  ? SERVICE_CONFIG.accountAbstraction.monthlyPrice * 12
                  : undefined
              }
              periodLabel={periodLabel}
              price={pricePerService.accountAbstraction}
              selected={includeAA}
            />
          </div>
        </div>
      </div>

      {/* Right column: order summary */}
      <div className="w-full lg:max-w-sm border rounded-md p-6 bg-muted/30 h-fit">
        <h3 className="font-medium mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {selectedOrder.map((key) => (
            <div className="flex justify-between" key={key}>
              <span>{SERVICE_CONFIG[key].label}</span>
              <span className="flex gap-1 items-center">
                {isAnnual && (
                  <span className="text-muted-foreground line-through text-xs">
                    {formatUSD(SERVICE_CONFIG[key].monthlyPrice * 12)}
                  </span>
                )}
                <span>
                  {formatUSD(pricePerService[key])}
                  {periodLabel}
                </span>
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-2 border-t mt-2">
            <span>Subtotal</span>
            <span>
              {formatUSD(subtotal)}
              {periodLabel}
            </span>
          </div>
          {bundleDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Bundle Discount (
                {Object.values(selectedServices).filter(Boolean).length === 2
                  ? "10%"
                  : "15%"}
                off)
              </span>
              <span>-{formatUSD(bundleDiscount)}</span>
            </div>
          )}

          {/* Billing Frequency Toggle */}
          <div className="flex items-center justify-between pt-4 bg-muted/70 rounded-lg p-3">
            <span className="text-sm font-medium">Pay annually & save 15%</span>
            <Switch
              checked={frequency === "annual"}
              onCheckedChange={(checked) =>
                setFrequency(checked ? "annual" : "monthly")
              }
            />
          </div>

          {/* Total Row */}
          <div className="flex justify-between font-semibold pt-4 border-t mt-4 mb-4">
            <span>Total</span>
            <p className="flex items-center gap-2">
              {totalSavings > 0 && (
                <span className="text-muted-foreground line-through text-xs">
                  {formatUSD(originalTotal)}
                </span>
              )}
              <span>
                {formatUSD(total)} {periodLabel}
              </span>
            </p>
          </div>

          <Button
            className="w-full"
            disabled={
              isTransitionPending ||
              !props.isOwner ||
              selectedOrder.length === 0
            }
            onClick={checkout}
          >
            Proceed to Checkout
          </Button>
          {!props.isOwner && (
            <p className="text-muted-foreground text-xs text-center">
              Only team owners can deploy infrastructure.
            </p>
          )}
        </div>
      </div>
      {/* RPC Omission Warning Modal */}
      <Dialog open={showRpcWarning} onOpenChange={setShowRpcWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proceed without RPC (not recommended)</DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                RPC powers core functionality used by <strong>Insight</strong>{" "}
                and <strong>Account Abstraction</strong>.
              </p>
              <div className="space-y-1">
                <p>Without RPC, you may experience:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Delayed or missing data in Insight</li>
                  <li>
                    Transaction failures or degraded reliability for Account
                    Abstraction
                  </li>
                  <li>Limited or unsupported features across both services</li>
                </ul>
              </div>
              <p>
                thirdweb <strong>cannot guarantee</strong> that Insight or
                Account Abstraction will work as expected without RPC. To ensure
                reliability, keep RPC enabled.
              </p>
              <p>If you still want to continue, confirm below.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                reportChainInfraRpcOmissionAgreed({
                  chainId,
                  frequency: frequency === "annual" ? "annual" : "monthly",
                  includeInsight,
                  includeAccountAbstraction: includeAA,
                });
                setShowRpcWarning(false);
                proceedToCheckout();
              }}
              variant="destructive"
            >
              I understand — proceed without RPC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Service Card Component ---
type IconKey = "RPCIcon" | "InsightIcon" | "SmartAccountIcon";

function getIcon(icon: IconKey) {
  switch (icon) {
    case "RPCIcon":
      return RPCIcon;
    case "InsightIcon":
      return InsightIcon;
    case "SmartAccountIcon":
      return SmartAccountIcon;
    default:
      return RPCIcon;
  }
}

function ServiceCard(props: {
  label: string;
  description: string;
  price: number;
  periodLabel: string;
  originalPrice?: number;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  icon: IconKey;
  onToggle: () => void;
}) {
  const {
    label,
    description,
    price,
    periodLabel,
    originalPrice,
    selected,
    disabled,
    required,
    icon,
    onToggle,
  } = props;
  return (
    <button
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg p-4 text-left transition-colors border",
        disabled
          ? "border-primary bg-primary/10"
          : selected
            ? "border-primary bg-primary/10 hover:bg-primary/10 hover:border-primary/50"
            : "hover:border-primary/50 hover:bg-muted/40",
      )}
      disabled={disabled}
      onClick={() => !disabled && onToggle()}
      type="button"
    >
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-lg leading-none flex gap-2 items-center">
          {(() => {
            const IconComp = getIcon(icon);
            return <IconComp className="size-4" />;
          })()}
          {label}
          {required && <Badge variant="outline">Always Included</Badge>}
        </h4>
        {!disabled && (
          <span
            className={cn(
              "size-4 rounded-full border flex items-center justify-center transition-colors",
              selected ? "bg-primary border-primary" : "",
            )}
          >
            {selected && <span className="size-2 bg-card rounded-full" />}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm min-h-[48px]">
        {description}
      </p>
      <p className="mt-auto font-medium flex items-center gap-2">
        {originalPrice && (
          <span className="text-muted-foreground line-through text-xs">
            {formatUSD(originalPrice)}
          </span>
        )}
        <span>
          {formatUSD(price)}
          {periodLabel}
        </span>
      </p>
    </button>
  );
}
