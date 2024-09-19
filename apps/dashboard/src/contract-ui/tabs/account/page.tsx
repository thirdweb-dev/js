import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
}

export const AccountPage: React.FC<AccountPageProps> = ({ contract }) => {
  const configuredChainsRecord = useSupportedChainsRecord();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;
  const symbol = chain?.nativeCurrency.symbol || "Native Token";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <Heading size="title.sm">Balances</Heading>
      </div>
      <AccountBalance contract={contract} />
      <div className="flex flex-row justify-between items-center">
        <Heading size="title.sm">Deposit {symbol}</Heading>
      </div>

      {chain && (
        <DepositNative
          address={contract.address}
          symbol={symbol}
          chain={chain}
        />
      )}

      <div className="flex flex-row justify-between items-center">
        <Heading size="title.sm">NFTs owned</Heading>
      </div>
      <NftsOwned contract={contract} />
    </div>
  );
};
