"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Tooltip } from "@chakra-ui/react";
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
  twAccount: Account | undefined;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  contract,
  twAccount,
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
      <Tooltip
        label={
          <Card className="bg-card px-4 py-2">
            <p>You can only initialize one account per EOA.</p>
          </Card>
        }
        bg="transparent"
        boxShadow="none"
        bgColor="backgroundHighlight"
        borderRadius="lg"
        placement="right"
        shouldWrapChildren
      >
        <Button variant="primary" disabled>
          Account Created
        </Button>
      </Tooltip>
    );
  }

  return (
    <TransactionButton
      twAccount={twAccount}
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
