import { CreditCardIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PaymentFrequency } from "./payment-frequency-selector";
import type { ServiceConfig } from "./service-selector";

export function OrderSummary(props: {
  selectedChainId: number;
  selectedServices: ServiceConfig[];
  paymentFrequency: PaymentFrequency;
}) {
  const pricing = calculatePricing(
    props.selectedServices,
    props.paymentFrequency,
  );

  return (
    <div className="space-y-4">
      {/* Selected Services */}
      <div className="space-y-2">
        <h4 className="font-medium">Selected Services</h4>
        {props.selectedServices.length > 0 ? (
          props.selectedServices.map((service) => {
            if (!service) return null;
            const Icon = service.icon;
            return (
              <div
                className="flex items-center justify-between py-2"
                key={service.id}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{service.name}</span>
                </div>
                <span className="text-sm font-medium">
                  $
                  {service.monthlyPrice.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                  /mo
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No services selected</p>
        )}
      </div>
      <Separator />

      {/* Pricing Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">
            Subtotal (
            {props.paymentFrequency === "annual" ? "12 months" : "monthly"}
            ):
          </span>
          <span className="text-sm font-medium">
            $
            {(
              pricing.baseMonthlyTotal *
              (props.paymentFrequency === "annual" ? 12 : 1)
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {pricing.bundleDiscount > 0 && (
          <div className="flex justify-between text-success-text">
            <span className="text-sm">
              Bundle Discount ({pricing.bundleDiscountPercent}%):
            </span>
            <span className="text-sm font-medium">
              -$
              {(
                pricing.bundleDiscount *
                (props.paymentFrequency === "annual" ? 12 : 1)
              ).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        {pricing.annualDiscount > 0 && (
          <div className="flex justify-between text-success-text">
            <span className="text-sm">Annual Discount (15%):</span>
            <span className="text-sm font-medium">
              -$
              {(
                pricing.annualDiscount *
                (props.paymentFrequency === "annual" ? 12 : 1)
              ).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>
            $
            {pricing.displayTotal.toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {pricing.totalSavings > 0 && (
          <div className="text-center">
            <Badge variant="success">
              You are saving $
              {pricing.totalSavings.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}{" "}
            </Badge>
          </div>
        )}
      </div>

      <Separator />

      {/* Checkout Button */}
      <Button
        className="w-full"
        disabled={!props.selectedChainId || props.selectedServices.length === 0}
        size="lg"
      >
        <CreditCardIcon className="w-4 h-4 mr-2" />
        {!props.selectedChainId
          ? "Select a chain"
          : props.selectedServices.length === 0
            ? "Select services"
            : "Complete Purchase"}
      </Button>
    </div>
  );
}

function calculatePricing(
  selectedServices: ServiceConfig[],
  paymentFrequency: PaymentFrequency,
) {
  const baseMonthlyTotal = selectedServices.reduce((total, service) => {
    return total + (service?.monthlyPrice || 0);
  }, 0);

  // Bundle discount calculation
  let bundleDiscount = 0;
  if (selectedServices.length === 3) {
    bundleDiscount = 0.15; // 15% for all three services
  } else if (selectedServices.length >= 2) {
    bundleDiscount = 0.1; // 10% for two or more services
  }

  // Annual discount
  const annualDiscount = paymentFrequency === "annual" ? 0.15 : 0;

  // Calculate discounts
  const bundleDiscountAmount = baseMonthlyTotal * bundleDiscount;
  const subtotalAfterBundle = baseMonthlyTotal - bundleDiscountAmount;
  const annualDiscountAmount = subtotalAfterBundle * annualDiscount;
  const monthlyFinalTotal = subtotalAfterBundle - annualDiscountAmount;

  // Calculate totals based on payment frequency
  const multiplier = paymentFrequency === "annual" ? 12 : 1;
  const displayTotal = monthlyFinalTotal * multiplier;

  return {
    annualDiscount: annualDiscountAmount,
    annualDiscountPercent: annualDiscount * 100,
    baseMonthlyTotal,
    bundleDiscount: bundleDiscountAmount,
    bundleDiscountPercent: bundleDiscount * 100,
    displayTotal,
    monthlyFinalTotal,
    totalSavings: (bundleDiscountAmount + annualDiscountAmount) * multiplier,
  };
}
