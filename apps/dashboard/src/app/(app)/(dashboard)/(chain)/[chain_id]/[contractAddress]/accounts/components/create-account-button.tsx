"use client";

import { PlusIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import {
  createAccount,
  getAccountsOfSigner,
  isAccountDeployed,
} from "thirdweb/extensions/erc4337";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";

export function CreateAccountButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const sendAndConfirmTx = useSendAndConfirmTx();

  const address = useActiveAccount()?.address;

  const isAccountDeployedQuery = useReadContract(isAccountDeployed, {
    adminSigner: address || "",
    contract: props.contract,
    data: "0x",
    queryOptions: {
      enabled: !!address,
    },
  });

  const accountsForAddressQuery = useReadContract(getAccountsOfSigner, {
    contract: props.contract,
    queryOptions: {
      enabled: !!address,
    },
    signer: address || "",
  });

  if (!address) {
    return null;
  }

  if (isAccountDeployedQuery.data && accountsForAddressQuery.data?.length) {
    return (
      <ToolTipLabel label="You can only initialize one account per EOA.">
        <Button disabled variant="default" size="sm" className="gap-2">
          <PlusIcon className="size-3.5" />
          Create Account
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <TransactionButton
      client={props.contract.client}
      disabled={isAccountDeployedQuery.data}
      isLoggedIn={props.isLoggedIn}
      variant="default"
      size="sm"
      isPending={sendAndConfirmTx.isPending}
      onClick={() => {
        const tx = createAccount({
          admin: address,
          contract: props.contract,
          data: "0x",
        });
        sendAndConfirmTx.mutate(tx);
      }}
      transactionCount={undefined}
      txChainID={props.contract.chain.id}
    >
      <PlusIcon className="size-3.5" />
      Create Account
    </TransactionButton>
  );
}
