"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { AccountBalance } from "./components/account-balance";
import { DepositNative } from "./components/deposit-native";
import { NftsOwned } from "./components/nfts-owned";

export function AccountPage(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  const {
    contract,
    chainMetadata,
    isLoggedIn,
    isInsightSupported,
    projectMeta,
  } = props;
  const symbol = chainMetadata.nativeCurrency.symbol;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-2">Balances</h2>
        <AccountBalance contract={contract} />
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight mb-2">
          Deposit {symbol}
        </h3>
        <DepositNative
          address={contract.address}
          chain={chainMetadata}
          client={contract.client}
          isLoggedIn={isLoggedIn}
          symbol={symbol}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight mb-1">
          NFTs owned
        </h3>
        <NftsOwned
          contract={contract}
          isInsightSupported={isInsightSupported}
          projectMeta={projectMeta}
        />
      </div>
    </div>
  );
}
