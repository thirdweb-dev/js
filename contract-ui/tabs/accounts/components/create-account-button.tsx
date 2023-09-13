import {
  useAccountsForAddress,
  useAddress,
  useContract,
  useCreateAccount,
  useIsAccountDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Button } from "tw-components";

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
      <Button colorScheme="primary" isDisabled>
        Account Created
      </Button>
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
