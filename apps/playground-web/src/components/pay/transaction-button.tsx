"use client";

import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { polygon, sepolia } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import {
  PayEmbed,
  TransactionButton,
  getDefaultToken,
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

const USDC = getDefaultToken(sepolia, "USDC");

const usdcContract = getContract({
  // biome-ignore lint/style/noNonNullAssertion: its there
  address: USDC!.address,
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});

export function PayTransactionPreview() {
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
      )}
    </>
  );
}

export function PayTransactionButtonPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return (
    <>
      <StyledConnectButton />
      {account && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            Price:{" "}
            {USDC?.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={USDC.icon} width={16} alt={USDC.name} />
            )}
            50 {USDC?.symbol}
          </div>
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
            Buy VIP Pass
          </TransactionButton>
        </div>
      )}
    </>
  );
}
