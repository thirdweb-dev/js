"use client";

import { apiServerProxy } from "@/actions/proxies";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { type CouponData, CouponsUI, type CouponsUIProps } from "./CouponsUI";

export function CouponsClient(
  props: Omit<
    CouponsUIProps,
    "applyCoupon" | "onCouponApplied" | "deleteCoupon"
  > & {
    teamId: string;
  },
) {
  const router = useDashboardRouter();
  return (
    <CouponsUI
      {...props}
      applyCoupon={async (promoCode: string) => {
        const res = await apiServerProxy<{ data: CouponData }>({
          body: JSON.stringify({
            promoCode,
            teamId: props.teamId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          pathname: "/v1/coupons/redeem",
        });

        if (!res.ok) {
          return {
            data: null,
            status: res.status,
          };
        }

        const json = res.data;

        router.refresh();

        return {
          data: json.data,
          status: 200,
        };
      }}
      deleteCoupon={async () => {
        const res = await apiServerProxy({
          method: "DELETE",
          pathname: "/v1/active-coupon",
          searchParams: props.teamId ? { teamId: props.teamId } : undefined,
        });

        if (!res.ok) {
          throw new Error("Failed to delete coupon");
        }

        router.refresh();
      }}
    />
  );
}
