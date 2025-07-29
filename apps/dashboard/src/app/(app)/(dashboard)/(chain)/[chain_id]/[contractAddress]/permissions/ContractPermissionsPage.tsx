"use client";

import { XIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { InlineCode } from "@/components/ui/inline-code";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";
import { Permissions } from "./components";

export function ContractPermissionsPage({
  contract,
  detectedPermissionEnumerable,
  chainSlug,
  isLoggedIn,
  projectMeta,
}: {
  contract: ThirdwebContract;
  detectedPermissionEnumerable: boolean;
  chainSlug: string;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  const explorerHref = buildContractPagePath({
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    projectMeta,
    subpath: "/explorer",
  });

  if (!detectedPermissionEnumerable) {
    return (
      <div className="p-4 lg:p-6 border rounded-lg bg-card">
        <div className="flex mb-5">
          <div className="p-2 rounded-full border bg-card">
            <XIcon className="size-5 text-muted-foreground" />
          </div>
        </div>

        <h3 className="text-xl font-semibold tracking-tight mb-1">
          Missing PermissionsEnumerable Extension
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          This contract does not support the{" "}
          <InlineCode code="PermissionsEnumerable" />
          extension.{" "}
          <UnderlineLink href="https://portal.thirdweb.com/tokens/build/extensions/general/Permissions">
            Learn more about permissions
          </UnderlineLink>
          <br />
          As a result, you can only view and manage basic permissions via the{" "}
          <UnderlineLink href={explorerHref}>Explorer</UnderlineLink>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-0.5">
        Permissions
      </h2>
      <p className="text-muted-foreground mb-6">
        View and manage the permissions for this contract
      </p>
      <Permissions contract={contract} isLoggedIn={isLoggedIn} />
    </div>
  );
}
