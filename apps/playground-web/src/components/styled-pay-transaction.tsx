"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { StyledConnectButton } from "./styled-connect-button";

const contract = getContract({
  address: "0x96B30d36f783c7BC68535De23147e2ce65788e93",
  chain: polygon,
  client: THIRDWEB_CLIENT,
});

export function StyledPayTransaction() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return account ? (
    <TransactionButton
      transaction={() => {
        if (!account) throw new Error("No active account");
        return claimTo({
          contract,
          quantity: 1n,
          tokenId: 0n,
          to: account?.address,
        });
      }}
      payModal={{
        theme: theme === "light" ? "light" : "dark",
      }}
    >
      Buy for 10 MATIC
    </TransactionButton>
  ) : (
    <StyledConnectButton />
  );
}
