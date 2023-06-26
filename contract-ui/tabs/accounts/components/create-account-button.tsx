import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  useAddress,
  useContract,
  useCreateSmartWallet,
  useIsSmartWalletDeployed,
  useSmartWalletsForAddress,
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
  const { mutate: createAccount, isLoading } = useCreateSmartWallet(
    contractQuery?.contract,
  );

  const network = useDashboardEVMChainId();
  const address = useAddress();
  const { data: isSmartWalletDeployed } = useIsSmartWalletDeployed(
    contractQuery.contract,
    address,
  );
  const { data: smartWalletsForAddress } = useSmartWalletsForAddress(
    contractQuery.contract,
    address,
  );

  if (!contractQuery.contract || !address) {
    return null;
  }

  if (isSmartWalletDeployed && smartWalletsForAddress?.length) {
    return (
      <LinkButton
        href={`/${network}/${smartWalletsForAddress[0]}`}
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
      isDisabled={isSmartWalletDeployed}
      {...restButtonProps}
    >
      Create Account
    </TransactionButton>
  );
};
