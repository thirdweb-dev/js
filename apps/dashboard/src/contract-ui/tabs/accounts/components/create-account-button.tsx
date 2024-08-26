import { Tooltip } from "@chakra-ui/react";
import {
  useAccountsForAddress,
  useContract,
  useCreateAccount,
  useIsAccountDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Button, Card, Text } from "tw-components";

interface CreateAccountButtonProps {
  contract: ThirdwebContract;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const contractQuery = useContract(contract.address);
  const { mutate: createAccount, isLoading } = useCreateAccount(
    contractQuery?.contract,
  );

  const address = useActiveAccount()?.address;
  const { data: isAccountDeployed } = useIsAccountDeployed(
    contractQuery.contract,
    address,
  );
  const { data: accountsForAddress } = useAccountsForAddress(
    contractQuery.contract,
    address,
  );

  if (!contractQuery.contract || !address) {
    return null;
  }

  if (isAccountDeployed && accountsForAddress?.length) {
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
      colorScheme="primary"
      onClick={() => createAccount(address)}
      isLoading={isLoading}
      transactionCount={1}
      isDisabled={isAccountDeployed}
      {...restButtonProps}
    >
      Create Account
    </TransactionButton>
  );
};
