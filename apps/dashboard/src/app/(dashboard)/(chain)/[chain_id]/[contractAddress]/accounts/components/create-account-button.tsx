"use client";

import { Tooltip } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import type { ThirdwebContract } from "thirdweb";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Button, Card, Text } from "tw-components";

interface CreateAccountButtonProps {
  contract: ThirdwebContract;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  contract,
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
          <Card py={2} px={4} bgColor="backgroundHighlight">
            <Text>You can only initialize one account per EOA.</Text>
          </Card>
        }
        bg="transparent"
        boxShadow="none"
        bgColor="backgroundHighlight"
        borderRadius="lg"
        placement="right"
        shouldWrapChildren
      >
        <Button colorScheme="primary" isDisabled>
          Account Created
        </Button>
      </Tooltip>
    );
  }

  return (
    <TransactionButton
      txChainID={contract.chain.id}
      colorScheme="primary"
      onClick={() => {
        const tx = ERC4337Ext.createAccount({
          contract,
          admin: address,
          data: "0x",
        });
        sendTxMutation.mutate(tx);
      }}
      isLoading={sendTxMutation.isPending}
      transactionCount={1}
      isDisabled={isAccountDeployedQuery.data}
      {...restButtonProps}
    >
      Create Account
    </TransactionButton>
  );
};
