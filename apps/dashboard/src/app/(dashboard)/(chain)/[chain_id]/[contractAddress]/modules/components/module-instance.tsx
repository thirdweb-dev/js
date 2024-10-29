"use client";

import { lazy } from "react";
import type { ThirdwebContract } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";

const MintableModule = lazy(() => import("./Mintable"));
const TransferableModule = lazy(() => import("./Transferable"));

export type ModuleInstanceProps = Omit<
  ModuleCardUIProps,
  "children" | "updateButton" | "isOwnerAccount"
> & {
  contract: ThirdwebContract;
  ownerAccount: Account | undefined;
};

export function ModuleInstance(props: ModuleInstanceProps) {
  if (props.contractInfo.name.includes("Transferable")) {
    return <TransferableModule {...props} />;
  }

  if (props.contractInfo.name.includes("Mintable")) {
    return <MintableModule {...props} />;
  }

  return <ModuleCardUI {...props} isOwnerAccount={!!props.ownerAccount} />;
}
