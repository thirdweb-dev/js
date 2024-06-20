import { Tooltip } from "@chakra-ui/react";
import {
  useAccountsForAddress,
  useAddress,
  useContract,
  useCreateAccount,
  useIsAccountDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Button, Card, Text } from "tw-components";

interface CreateAccountButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { mutate: createAccount, isLoading } = useCreateAccount(
    contractQuery?.contract,
  );

  const address = useAddress();
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
