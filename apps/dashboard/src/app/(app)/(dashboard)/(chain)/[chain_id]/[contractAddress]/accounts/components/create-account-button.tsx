"use client";

import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TransactionButton } from "components/buttons/TransactionButton";
import type { ThirdwebContract } from "thirdweb";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";

interface CreateAccountButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  contract,
  isLoggedIn,
  ...restButtonProps
}) => {
  const sendTxMutation = useSendAndConfirmTransaction();

  const address = useActiveAccount()?.address;

  const isAccountDeployedQuery = useReadContract(ERC4337Ext.isAccountDeployed, {
    contract,
    adminSigner: address || "",
    data: "0x",
    queryOptions: {
      enabled: !!address,
    },
  });

  const accountsForAddressQuery = useReadContract(
    ERC4337Ext.getAccountsOfSigner,
    {
      contract,
      signer: address || "",
      queryOptions: {
        enabled: !!address,
      },
    },
  );

  if (!address) {
    return null;
  }

  if (isAccountDeployedQuery.data && accountsForAddressQuery.data?.length) {
    return (
      <ToolTipLabel label="You can only initialize one account per EOA.">
        <Button variant="primary" disabled>
          Account Created
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <TransactionButton
      isLoggedIn={isLoggedIn}
      txChainID={contract.chain.id}
      onClick={() => {
        const tx = ERC4337Ext.createAccount({
          contract,
          admin: address,
          data: "0x",
        });
        sendTxMutation.mutate(tx);
      }}
      isPending={sendTxMutation.isPending}
      transactionCount={1}
      disabled={isAccountDeployedQuery.data}
      {...restButtonProps}
    >
      Create Account
    </TransactionButton>
  );
};
