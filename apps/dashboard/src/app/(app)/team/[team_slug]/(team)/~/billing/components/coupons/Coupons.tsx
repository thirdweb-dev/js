import { Suspense } from "react";
import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { CouponsClient } from "./CouponsClient";
import type { CouponData } from "./CouponsUI";

async function AsyncCoupons(props: {
  teamId: string;
  isPaymentSetup: boolean;
}) {
  const authToken = await getAuthToken();

  const allCouponsPromise = fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/active-coupons?teamId=${props.teamId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  const accountCouponPromise = fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/active-coupon?teamId=${props.teamId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  const [allCouponsRes, accountCouponRes] = await Promise.allSettled([
    allCouponsPromise,
    accountCouponPromise,
  ]);

  if (
    allCouponsRes.status === "rejected" ||
    accountCouponRes.status === "rejected"
  ) {
    return (
      <CouponsClient
        accountCouponId={undefined}
        activeCoupons={[]}
        isPaymentSetup={props.isPaymentSetup}
        status="error"
        teamId={props.teamId}
      />
    );
  }

  const allCouponsData = (await allCouponsRes.value.json()) as {
    data: CouponData[];
  };

  const accountCouponData = (await accountCouponRes.value.json()) as {
    data: CouponData | null;
  };

  return (
    <CouponsClient
      accountCouponId={accountCouponData.data?.id}
      activeCoupons={allCouponsData.data}
      isPaymentSetup={props.isPaymentSetup}
      status="success"
      teamId={props.teamId}
    />
  );
}

export function Coupons(props: { teamId: string; isPaymentSetup: boolean }) {
  return (
    <Suspense
      fallback={
        <CouponsClient
          accountCouponId={undefined}
          activeCoupons={[]}
          isPaymentSetup={true}
          status="pending"
          teamId={props.teamId}
        />
      }
    >
      <AsyncCoupons
        isPaymentSetup={props.isPaymentSetup}
        teamId={props.teamId}
      />
    </Suspense>
  );
}
