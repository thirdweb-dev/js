import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  useAccountsForAddress,
  useAddress,
  useContract,
  useCreateAccount,
  useIsAccountDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { LinkButton } from "tw-components";

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

  const network = useDashboardEVMChainId();
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
      <LinkButton
        href={`/${network}/${accountsForAddress[0]}`}
        colorScheme="primary"
      >
        Go to Account
      </LinkButton>
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
