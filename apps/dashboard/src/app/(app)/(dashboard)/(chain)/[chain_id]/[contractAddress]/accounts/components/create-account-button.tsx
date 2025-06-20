"use client";

import { TransactionButton } from "components/buttons/TransactionButton";
import type { ThirdwebContract } from "thirdweb";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";

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
    adminSigner: address || "",
    contract,
    data: "0x",
    queryOptions: {
      enabled: !!address,
    },
  });

  const accountsForAddressQuery = useReadContract(
    ERC4337Ext.getAccountsOfSigner,
    {
      contract,
      queryOptions: {
        enabled: !!address,
      },
      signer: address || "",
    },
  );

  if (!address) {
    return null;
  }

  if (isAccountDeployedQuery.data && accountsForAddressQuery.data?.length) {
    return (
      <ToolTipLabel label="You can only initialize one account per EOA.">
        <Button disabled variant="primary">
          Account Created
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <TransactionButton
      client={contract.client}
      disabled={isAccountDeployedQuery.data}
      isLoggedIn={isLoggedIn}
      isPending={sendTxMutation.isPending}
      onClick={() => {
        const tx = ERC4337Ext.createAccount({
          admin: address,
          contract,
          data: "0x",
        });
        sendTxMutation.mutate(tx);
      }}
      transactionCount={1}
      txChainID={contract.chain.id}
      {...restButtonProps}
    >
      Create Account
    </TransactionButton>
  );
};
