"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useEffect, useRef } from "react";
import type { ThirdwebContract } from "thirdweb";
import { LoadingPage } from "./page-skeletons";

export function RedirectToContractOverview(props: {
  contract: ThirdwebContract;
}) {
  const router = useDashboardRouter();
  const redirected = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (redirected.current) {
      return;
    }
    redirected.current = true;
    router.replace(`/${props.contract.chain.id}/${props.contract.address}`);
  }, [router, props.contract]);

  return <LoadingPage />;
}
