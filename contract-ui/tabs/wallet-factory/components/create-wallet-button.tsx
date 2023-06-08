import {
  useAddress,
  useContract,
  useCreateSmartWallet,
  useIsSmartWalletDeployed,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";

interface CreateWalletButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const CreateWalletButton: React.FC<CreateWalletButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const { mutate: createWallet, isLoading } = useCreateSmartWallet(
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
      onClick={() => createWallet(address)}
      isLoading={isLoading}
      transactionCount={1}
      isDisabled={isSmartWalletDeployed}
      {...restButtonProps}
    >
      Create Wallet
    </TransactionButton>
  );
};
