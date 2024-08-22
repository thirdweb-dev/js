"use client";

import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { base, polygon } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import {
  PayEmbed,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

const nftContract = getContract({
  address: "0x827c1c3889923015C1FC31BF677D00FbE6F01D52",
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
  const { data: nft } = useReadContract(getNFT, {
    contract: nftContract,
    tokenId: 0n,
  });

  return (
    <>
      <StyledConnectButton />
      <div className="h-10" />
      {account && (
        <>
          <PayEmbed
            client={THIRDWEB_CLIENT}
            theme={theme === "light" ? "light" : "dark"}
            payOptions={{
              mode: "transaction",
              transaction: claimTo({
                contract: nftContract,
                quantity: 1n,
                tokenId: 0n,
                to: account?.address || "",
              }),
              metadata: nft?.metadata,
            }}
          />
          <div className="h-10" />
          <h4 className="font-bold py-4">ERC20 Transfer (no metadata)</h4>
          <TransactionButton
            transaction={() => {
              if (!account) throw new Error("No active account");
              return transfer({
                contract: usdcContract,
                amount: "50",
                to: account?.address || "",
              });
            }}
            onError={(e) => {
              console.error(e);
            }}
            payModal={{
              theme: theme === "light" ? "light" : "dark",
            }}
          >
            Buy NFT
          </TransactionButton>
        </>
      )}
    </>
  );
}
