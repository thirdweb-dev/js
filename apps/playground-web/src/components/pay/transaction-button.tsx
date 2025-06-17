"use client";

import { useTheme } from "next-themes";
import { getContract, prepareTransaction } from "thirdweb";
import { base, baseSepolia, polygon } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import {
  TransactionButton,
  TransactionWidget,
  getDefaultToken,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { toWei } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

const nftContract = getContract({
  address: "0xf0d0CBf84005Dd4eC81364D1f5D7d896Bd53D1B8",
  chain: base,
  client: THIRDWEB_CLIENT,
});

const USDC = getDefaultToken(polygon, "USDC");

const usdcContract = getContract({
  // biome-ignore lint/style/noNonNullAssertion: its there
  address: USDC!.address,
  chain: polygon,
  client: THIRDWEB_CLIENT,
});

export function PayTransactionPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();
  const { data: nft } = useReadContract(getNFT, {
    contract: nftContract,
    tokenId: 2n,
  });

  return (
    <TransactionWidget
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      transaction={claimTo({
        contract: nftContract,
        quantity: 1n,
        tokenId: 2n,
        to: account?.address || "",
      })}
      amount={100n}
      title={nft?.metadata?.name}
      description={nft?.metadata?.description}
      image={nft?.metadata?.image}
    />
  );
}

export function PayTransactionButtonPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return (
    <>
      <StyledConnectButton />
      <div className="h-10" />
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
          <div className="h-10" />
          <div className="flex items-center gap-2">Price: 0.1 ETH</div>
          <TransactionButton
            transaction={() => {
              if (!account) throw new Error("No active account");
              return prepareTransaction({
                chain: baseSepolia,
                client: THIRDWEB_CLIENT,
                to: account.address,
                value: toWei("0.1"),
              });
            }}
            onError={(e) => {
              console.error(e);
            }}
            payModal={{
              theme: theme === "light" ? "light" : "dark",
            }}
          >
            Send 0.1 ETH
          </TransactionButton>
        </div>
      )}
    </>
  );
}
