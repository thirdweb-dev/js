import {
  useAddress,
  useContract,
  useCreateSmartWallet,
  useIsSmartWalletDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";

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

  const address = useAddress();
  const { data: isSmartWalletDeployed } = useIsSmartWalletDeployed(
    contractQuery.contract,
    address,
  );

  if (!contractQuery.contract || !address) {
    return null;
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
