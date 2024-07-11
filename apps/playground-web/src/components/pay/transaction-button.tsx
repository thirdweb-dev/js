"use client";

import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { base, polygon } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc1155";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

const nftContract = getContract({
  address: "0x96B30d36f783c7BC68535De23147e2ce65788e93",
  chain: polygon,
  client: THIRDWEB_CLIENT,
});

const usdcContract = getContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: base,
  client: THIRDWEB_CLIENT,
});

export function PayTransactionButtonPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return (
    <>
      <StyledConnectButton />
      <TransactionButton
        transaction={() => {
          if (!account) throw new Error("No active account");
          return transfer({
            contract: usdcContract,
            amount: "15",
            to: account?.address,
          });
        }}
        payModal={{
          theme: theme === "light" ? "light" : "dark",
        }}
      >
        Pay 15 USDC
      </TransactionButton>

      <TransactionButton
        transaction={() => {
          if (!account) throw new Error("No active account");
          return claimTo({
            contract: nftContract,
            quantity: 1n,
            tokenId: 0n,
            to: account?.address,
          });
        }}
        payModal={{
          theme: theme === "light" ? "light" : "dark",
        }}
      >
        Buy NFT for 10 MATIC
      </TransactionButton>
    </>
  );
}
