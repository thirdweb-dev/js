"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { Heading } from "tw-components";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

interface AccountPageProps {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  contract,
  chainMetadata,
  isLoggedIn,
  isInsightSupported,
  projectMeta,
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
          chain={chainMetadata}
          client={contract.client}
          isLoggedIn={isLoggedIn}
          symbol={symbol}
        />
      )}

      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">NFTs owned</Heading>
      </div>
      <NftsOwned
        contract={contract}
        isInsightSupported={isInsightSupported}
        projectMeta={projectMeta}
      />
    </div>
  );
};
