"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";
import { useActiveWalletChain } from "thirdweb/react";
import { isOpChainId } from "../../../../team/[team_slug]/[project_slug]/connect/account-abstraction/isOpChain";

export function OpChainAlert() {
  const chain = useActiveWalletChain();
  const isOpChain = chain?.id ? isOpChainId(chain.id) : false;

  if (!isOpChain) {
    return null;
  }

  return (
    <Alert variant="info">
      <CircleAlertIcon className="size-4" />
      <AlertTitle>Using the gas credits for OP chain paymaster</AlertTitle>
      <AlertDescription>
        Credits will automatically be applied to cover gas fees for any onchain
        activity across thirdweb services. <br />
        Eligible chains: OP Mainnet, Base, Zora, Frax, Mode.
      </AlertDescription>
    </Alert>
  );
}
