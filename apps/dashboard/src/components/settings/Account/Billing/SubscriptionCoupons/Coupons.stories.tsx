import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { type CouponData, CouponsUI } from "./CouponsUI";

const meta = {
  title: "Billing/Coupons",
  component: Story,
} satisfies Meta<typeof CouponsUI>;

export default meta;
type Story = StoryObj<typeof CouponsUI>;

const couponStubs: CouponData[] = [
  // Forever
  {
    id: "di_1QAE7jCQUO4TBFqFQgnS4Qj4",
    start: 1729011691,
    end: null,
    coupon: {
      id: "forever_active",
      name: "Example 1",
      duration: "forever",
      duration_in_months: null,
    },
  },

  // Once
  {
    id: "once",
    start: 1733391052,
    end: null,
    coupon: {
      id: "once_active",
      name: "Example 2",
      duration: "once",
      duration_in_months: null,
    },
  },

  // Repeating - 3 months
  {
    id: "repeating-3",
    start: 1733391629,
    end: 1743391629, // Will end in the future
    coupon: {
      id: "repeating_active",
      name: "Example 3",
      duration: "repeating",
      duration_in_months: 3,
    },
  },

  // Repeating - 1 month
  {
    id: "repeating-1",
    start: 1733391713,
    end: 1736391713,
    coupon: {
      id: "repeating_single",
      name: "Example 4",
      duration: "repeating",
      duration_in_months: 1,
    },
  },
];

export const Variants: Story = {
  args: {},
};

function Story() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "success",
  );

  const [activeCouponsType, setActiveCouponsType] = useState<
    "multiple" | "zero" | "one"
  >("multiple");

  const activeCoupons = useMemo(() => {
    if (activeCouponsType === "multiple") {
      return couponStubs;
    }

    if (activeCouponsType === "zero") {
      return [];
    }

    if (activeCouponsType === "one") {
      return couponStubs.slice(0, 1);
    }

    return [];
  }, [activeCouponsType]);

  const [hasAccountCoupon, setHasAccountCoupon] = useState(true);
  const [isPaymentSetup, setIsPaymentSetup] = useState(true);
  const [applyCouponStatus, setApplyCouponStatus] = useState<
    200 | 400 | 401 | 409 | 429 | 500
  >(200);

  return (
    <div className="container max-w-[1100px] py-10">
      <div className="mb-8 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Status</h3>
            <RadioGroup
              value={status}
              onValueChange={(value) =>
                setStatus(value as "pending" | "error" | "success")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="error" id="status-error" />
                <Label htmlFor="status-error">Error</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="success" id="status-success" />
                <Label htmlFor="status-success">Success</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Active Coupons</h3>
            <RadioGroup
              value={activeCouponsType}
              onValueChange={(value) =>
                setActiveCouponsType(value as "multiple" | "zero" | "one")
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="coupons-multiple" />
                <Label htmlFor="coupons-multiple">Multiple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zero" id="coupons-zero" />
                <Label htmlFor="coupons-zero">Zero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one" id="coupons-one" />
                <Label htmlFor="coupons-one">One</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Apply Coupon Status</h3>
            <RadioGroup
              value={applyCouponStatus.toString()}
              className="flex gap-4"
              onValueChange={(value) =>
                setApplyCouponStatus(
                  Number.parseInt(value) as 200 | 400 | 401 | 409 | 429 | 500,
                )
              }
            >
              {[200, 400, 401, 409, 429, 500].map((code) => (
                <div key={code} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={code.toString()}
                    id={`status-${code}`}
                  />
                  <Label htmlFor={`status-${code}`}>{code}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Other Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch
                id="has-account-coupon"
                checked={hasAccountCoupon}
                onCheckedChange={setHasAccountCoupon}
              />
              <Label htmlFor="has-account-coupon">Has Account Coupon</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                id="payment-setup"
                checked={isPaymentSetup}
                onCheckedChange={setIsPaymentSetup}
              />
              <Label htmlFor="payment-setup">Payment Setup</Label>
            </div>
          </div>
        </div>
      </div>

      <CouponsUI
        status={status}
        activeCoupons={activeCoupons}
        accountCouponId={hasAccountCoupon ? activeCoupons[0]?.id : undefined}
        isPaymentSetup={isPaymentSetup}
        applyCoupon={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            status: applyCouponStatus,
            data:
              applyCouponStatus === 200
                ? {
                    id: "xyz",
                    start: 1727992716,
                    end: 1759528716,
                    coupon: {
                      id: "test",
                      name: "TEST COUPON",
                      duration: "repeating",
                      duration_in_months: 12,
                    },
                  }
                : null,
          };
        }}
        deleteCoupon={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </div>
  );
}
