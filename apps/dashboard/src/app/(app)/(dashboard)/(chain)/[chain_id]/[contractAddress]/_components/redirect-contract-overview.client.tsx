"use client";

import { useEffect, useRef } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";
import { LoadingPage } from "./page-skeletons";

export function RedirectToContractOverview(props: {
  contract: ThirdwebContract;
  projectMeta: ProjectMeta | undefined;
}) {
  const router = useDashboardRouter();
  const redirected = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (redirected.current) {
      return;
    }
    redirected.current = true;
    const landingPage = buildContractPagePath({
      chainIdOrSlug: props.contract.chain.id.toString(),
      contractAddress: props.contract.address,
      projectMeta: props.projectMeta,
    });

    router.replace(landingPage);
  }, [router, props]);

  return <LoadingPage />;
}
