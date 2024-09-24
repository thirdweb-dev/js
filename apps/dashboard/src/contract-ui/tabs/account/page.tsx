import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { useAllChainsData } from "../../../hooks/chains/allChains";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
}

export const AccountPage: React.FC<AccountPageProps> = ({ contract }) => {
  const { idToChain } = useAllChainsData();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? idToChain.get(chainId) : undefined;
  const symbol = chain?.nativeCurrency.symbol || "Native Token";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Balances</Heading>
      </div>
      <AccountBalance contract={contract} />
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Deposit {symbol}</Heading>
      </div>

      {chain && (
        <DepositNative
          address={contract.address}
          symbol={symbol}
          chain={chain}
        />
      )}

      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">NFTs owned</Heading>
      </div>
      <NftsOwned contract={contract} />
    </div>
  );
};
