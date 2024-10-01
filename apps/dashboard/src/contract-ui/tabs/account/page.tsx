"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { Heading } from "tw-components";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  contract,
  chainMetadata,
}) => {
  const symbol = chainMetadata.nativeCurrency.symbol || "Native Token";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Balances</Heading>
      </div>
      <AccountBalance contract={contract} />
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Deposit {symbol}</Heading>
      </div>

      {chainMetadata && (
        <DepositNative
          address={contract.address}
          symbol={symbol}
          chain={chainMetadata}
        />
      )}

      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">NFTs owned</Heading>
      </div>
      <NftsOwned contract={contract} />
    </div>
  );
};
